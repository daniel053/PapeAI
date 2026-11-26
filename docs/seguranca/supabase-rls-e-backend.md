# Supabase — RLS, chaves e backend ("camadas de usuário não expostas")

## As chaves do Supabase (entenda antes de tudo)
| Chave | Nome atual (sistema novo) | Nome antigo | Pode ir no app? | Por quê |
|---|---|---|---|---|
| Pública | *publishable key* | `anon` key | **Sim** | É pública por design. Quem protege os dados é o **RLS**, não o segredo dessa chave |
| Secreta | *secret key* | `service_role` key | **NUNCA** | Ignora o RLS: quem tem essa chave lê e apaga tudo |

> Na F02, confirmar na documentação oficial qual sistema de chaves o projeto usa e atualizar esta tabela.
> A chave secreta vive **somente** em secrets das Edge Functions (`supabase secrets set ...`) e, se necessário, em secrets protegidos do GitHub Actions. Nunca em `.env` do app, nunca no repositório.

## "Camadas de usuário não expostas" — o que isso significa aqui
| Camada | Regra |
|---|---|
| Esquemas expostos | Só `public` é exposto pela API. Tudo interno fica em `private` (não exposto). GraphQL desativado se não usarmos (menos superfície) |
| Tabelas | RLS ativo em **todas** as tabelas de `public`; `anon` sem acesso a nenhuma |
| Colunas | Grants por coluna onde o usuário só pode alterar parte da linha (ex.: `profiles`) |
| Linhas | Cada usuário só enxerga as próprias (`(select auth.uid()) = user_id`) |
| Relações | FKs compostas impedem ligar dados ao registro de outra pessoa |
| Funções | `security definer` só quando necessário, com `set search_path = ''`, checagem do chamador e `execute` só para `authenticated` |
| Views | Sempre `security_invoker = true` (senão ignoram o RLS) |
| Storage | Nenhum bucket público com dados de usuário (não planejamos uploads) |
| Realtime | Desligado para tabelas de usuário (não precisamos) |
| Identificadores | UUIDs opacos; nenhuma URL do app expõe IDs de outros usuários |
| Erros | Mensagens genéricas ao usuário; detalhes só em logs sem dados pessoais |
| Perfis públicos | **Não existem.** Não há como listar ou buscar usuários |

## Armadilhas comuns de RLS (checar em toda revisão)
1. Esquecer `enable row level security` numa tabela nova.
2. Política `using (true)` "provisória" que fica para sempre.
3. Política de `update` sem `with check` (permite mudar `user_id` para outro dono).
4. Views sem `security_invoker` expondo dados.
5. Função `security definer` em `public` sem checar `auth.uid()`.
6. FK simples permitindo apontar para a linha de outro usuário (FK não passa pelo RLS).
7. Usar `user_metadata` (editável pelo usuário) em política.
8. Falta de índice em `user_id` (RLS lento).
9. Grants amplos herdados (`grant all`) em tabelas novas.
10. Confiar em filtro do app (`.eq('user_id', ...)`) em vez do RLS.

## Edge Functions planejadas
| Função | Fase | Quem chama | Autenticação | Limite | Segredos usados |
|---|---|---|---|---|---|
| `delete-account` | F02 | App (usuário logado) | JWT + código de confirmação recente | 3/dia | secret key |
| `export-data` | F02 | App | JWT | 3/dia | — (lê com o JWT do usuário, respeitando RLS) |
| `account-deletion-request` | F02/F10 | Página pública do site | Envia código ao e-mail; só exclui após confirmação | por IP e por e-mail | secret key |
| `send-email` | F09 | Interno (outras funções, cron) | Segredo interno; não invocável pelo público | interno | Resend API key |
| `weekly-summary` / `monthly-report` / `reengagement` / `travel-countdown` | F09 | `pg_cron` | Segredo interno | idempotência por usuário/período | secret key, Resend |
| `unsubscribe` | F09 | Link no e-mail (público) | Token HMAC assinado por usuário+tipo, sem login | por IP | segredo HMAC |
| `validate-purchase` | F12 | App | JWT + validação na API da loja | por usuário | credenciais da loja |

Regras para todas as funções:
- Validar entrada com zod; rejeitar campos desconhecidos.
- Identificar o usuário **pelo JWT**, nunca por `user_id` no corpo.
- CORS só para as origens do app.
- Respostas de erro genéricas; logs sem e-mail, sem tokens, sem conteúdo do usuário.
- Timeout e limite de tamanho de corpo.
- Testes automatizados (unitários com mocks + chamada no projeto de dev).

## Testes de RLS (obrigatórios a partir da F02)
**Abordagem padrão (sem Docker):** script de testes (Vitest) contra o projeto de **desenvolvimento**, com dois usuários fictícios (`teste-a`, `teste-b`) autenticados via código de e-mail de teste ou usuários criados pelo seed.
**Abordagem local (com Docker, Q-13):** pgTAP via Supabase CLI.

Matriz gerada para **cada tabela × operação**:
| Ator | select | insert | update | delete |
|---|---|---|---|---|
| Dono (A nas linhas de A) | conforme matriz de `../dados/modelo-de-dados.md` | idem | idem | idem |
| Outro usuário (B nas linhas de A) | **0 linhas** | **negado** | **0 linhas afetadas** | **0 linhas afetadas** |
| Anônimo | **negado** | **negado** | **negado** | **negado** |
| FK cruzada (A cria linha apontando para registro de B) | — | **negado** | **negado** | — |

O teste falha se alguma tabela de `public` não estiver coberta (lista de tabelas lida do próprio banco).

## Ferramentas de verificação do Supabase
- **Security Advisor / linter do banco:** zero erros antes de cada portão (print ou saída no relatório).
- **Performance Advisor:** revisar índices sugeridos.
- Logs de Auth e de Edge Functions: conferir que não há dados sensíveis.

## Conta e projeto
- MFA na conta do Supabase; o mínimo de membros na organização.
- Dois projetos: `papeai-dev` e `papeai-prod` (região **São Paulo** para produção — PRIV-07; confirmar disponibilidade na criação).
- Lembrete: projetos gratuitos **pausam após 7 dias sem atividade** — normal no dev; em produção, monitorar.

## Rotação de segredos (procedimento)
1. Gerar novo segredo no provedor (Supabase/Resend/Google).
2. Atualizar `supabase secrets set ...` (e GitHub Secrets, se houver).
3. Reimplantar funções afetadas; testar.
4. Revogar o segredo antigo.
5. Registrar data em `resposta-a-incidentes.md` (seção de histórico), sem o valor.

## Backups
- O plano gratuito tem limitações de backup/restauração (confirmar a política vigente na F02 e registrar aqui).
- O **schema** está sempre no Git (migrações). Para **dados**, decidir na F11 se haverá exportação periódica cifrada — e onde guardá-la sem criar um novo risco de vazamento.
