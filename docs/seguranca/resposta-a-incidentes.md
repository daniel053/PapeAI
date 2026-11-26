# Resposta a incidentes

> Saber o que fazer **antes** de precisar. Em incidente, a ordem é: **conter → avaliar → corrigir → comunicar → aprender**.

## Severidade
| Nível | Exemplo | Tempo para conter |
|---|---|---|
| **S1 — Crítico** | Chave secreta do Supabase vazada; XSS explorável em produção; dependência maliciosa publicada no app | Imediato (horas) |
| **S2 — Alto** | Falha de RLS expondo dados de outro usuário; conta de desenvolvedor comprometida | Mesmo dia |
| **S3 — Médio** | Vulnerabilidade sem exploração conhecida; segredo de dev vazado | Dias |
| **S4 — Baixo** | Melhoria de configuração; cabeçalho faltando | Próximo ciclo |

## Papéis
- **Dono do projeto:** decide, executa ações nas contas (a IA não tem acesso a elas), comunica.
- **IA:** ajuda a diagnosticar, escreve correções, prepara comunicados e o pós-mortem.

## Roteiros por cenário
### R1 — Chave secreta do Supabase (ou outro segredo do servidor) vazou
1. Rotacionar o segredo imediatamente (procedimento em `supabase-rls-e-backend.md`).
2. Reimplantar funções; confirmar que a chave antiga não funciona.
3. Revisar logs do Supabase do período (acessos estranhos, exclusões em massa).
4. Remover o segredo do histórico do Git, se foi commitado (e considerar o segredo comprometido mesmo assim).
5. Avaliar se houve acesso a dados pessoais → se sim, seguir "Comunicação".

### R2 — Suspeita de XSS ou de dependência maliciosa no app
1. Tirar a versão do ar ou reverter para a última versão boa (deploy anterior na Cloudflare).
2. Identificar o vetor (código nosso? dependência? versão?).
3. Corrigir, adicionar teste que reproduz o problema, publicar.
4. Avisar usuários para **revogar e recriar a chave de API** na Console (a chave pode ter sido lida no aparelho).
5. Comunicar publicamente no GitHub (aviso de segurança) e no app.

### R3 — Falha de RLS (um usuário viu dados de outro)
1. Corrigir a política com migração nova (ou bloquear a tabela temporariamente).
2. Adicionar o caso aos testes de RLS.
3. Levantar quais dados/usuários foram afetados (logs).
4. Avaliar comunicação à ANPD e aos titulares.

### R4 — Conta de desenvolvedor comprometida (GitHub, Google, Supabase, Cloudflare, registrador)
1. Recuperar a conta; trocar senha; revisar e reforçar MFA; encerrar sessões.
2. Revisar mudanças recentes: commits, releases, configurações de DNS, secrets, membros.
3. Rotacionar todos os segredos acessíveis por aquela conta.
4. Verificar se algum deploy malicioso foi publicado (tratar como R2).

### R5 — Usuário relata que a chave de API dele foi usada sem permissão
1. Orientar: revogar a chave na Console imediatamente e criar outra; ativar limite de gasto.
2. Coletar informações sem pedir a chave: aparelho, navegador, extensões, se compartilhou a chave em outro app.
3. Investigar se há relação com o PapeAI (R2).
4. Responder com transparência.

### R6 — Domínio ou DNS sequestrado / domínio expirando
1. Contatar o registrador; recuperar acesso; ativar bloqueio de transferência.
2. Avisar no GitHub o domínio oficial e que qualquer outro é falso.

### R7 — Projeto de produção pausado ou limite do plano atingido
1. Reativar/ajustar no painel; comunicar instabilidade no app.
2. Avaliar plano B em `../arquitetura/custos-e-limites.md`.

## Comunicação
- **Aos titulares e à ANPD:** quando o incidente puder gerar risco ou dano relevante, no prazo do regulamento da ANPD (confirmar na F11). Conteúdo mínimo: o que aconteceu, quais dados, quando, medidas tomadas, o que o usuário deve fazer, contato.
- **Pública:** aviso de segurança no GitHub (Security Advisory) + mensagem no app.
- Linguagem clara, sem minimizar e sem alarmismo.

### Modelo de comunicado
```markdown
**[PapeAI] Aviso de segurança — <data>**
O que aconteceu: ...
Dados afetados: ...
Período: ...
O que já fizemos: ...
O que você deve fazer: (ex.: revogar sua chave em https://platform.claude.com/settings/keys e criar outra)
Contato: ...
```

## Pós-mortem (sem culpados) — modelo
```markdown
# Pós-mortem — <título> (<data>)
- Severidade:
- Linha do tempo (detecção → contenção → correção → comunicação):
- Causa raiz:
- O que funcionou:
- O que falhou:
- Ações (com responsável e prazo):
- Testes/regras adicionados para não repetir:
```

## Contatos e acessos (preencher na F00/F11 — sem senhas aqui)
| Serviço | Onde gerenciar | MFA ativo? |
|---|---|---|
| GitHub | github.com/settings/security | ☐ |
| Supabase | supabase.com/dashboard | ☐ |
| Google Cloud / Play Console | console.cloud.google.com / play.google.com/console | ☐ |
| Cloudflare | dash.cloudflare.com | ☐ |
| Claude Console | platform.claude.com | ☐ |
| Resend | resend.com | ☐ |
| Registrador do domínio | (a definir) | ☐ |

## Histórico de incidentes e rotações
_Nenhum registro ainda._
