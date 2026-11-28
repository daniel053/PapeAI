# F02 — Contas, usuários e dados no servidor

> **Status:** ⏳ Não iniciada

## Objetivo
Login com **Google** e **e-mail e senha**, primeiro acesso com termos/privacidade, perfil mínimo, banco **v0** com RLS testado, **exportar** e **excluir** conta — tudo nos projetos Supabase de desenvolvimento e produção.

## Documentos desta fase
1. `../dados/modelo-de-dados.md`, `../dados/evolucao-e-migracoes.md`, `../dados/changelog-do-schema.md`
2. `../seguranca/autenticacao-e-sessoes.md`
3. `../seguranca/supabase-rls-e-backend.md`
4. `../seguranca/privacidade-lgpd.md`
5. `../dados/armazenamento-local.md` (sessão e limpeza no logout)
6. `../seguranca/checklist-de-seguranca-por-fase.md` (F02)

## Pré-requisitos
- F01 aprovada. ADR-0002, 0006, 0010 e 0011 aceitas. Q-13 respondida (Docker ou dev na nuvem).

## Escopo
**Inclui:** projetos `papeai-dev` e `papeai-prod` (região São Paulo), Supabase CLI e migrações, schema v0 (`languages`, `language_variants`, `profiles`, `learning_profiles` mínimo, `notification_preferences`, `consent_records`, funções/gatilhos privados), testes de RLS, Google OAuth, e-mail e senha, Turnstile, telas de login/primeiro acesso, sair/sair de todos, Edge Functions `export-data`, `delete-account` e `account-deletion-request`, camada `core/data`.
**Não inclui:** chave de API (F03), objetivos/nivelamento (F05), SMTP próprio (F09 — no dev usamos o padrão).

## Passos
### A. Supabase
- [ ] Confirmar na documentação oficial: sistema de chaves (publishable/secret), mudança de grants explícitos, opções de Auth, comandos da CLI. Registrar em `../seguranca/supabase-rls-e-backend.md`.
- [ ] Criar `papeai-dev` (dono, com MFA); instalar/configurar a CLI; `supabase/` no repositório.
- [ ] Desativar o que não usamos (GraphQL se possível, Realtime nas tabelas, provedores de login não usados).

### B. Schema v0 (migrações)
- [ ] Tipos (enums) e tabelas de referência.
- [ ] `profiles`, `learning_profiles` (mínimo), `notification_preferences`, `consent_records` com RLS, grants explícitos, FKs compostas, checks, índices.
- [ ] `private.handle_new_user()`, `private.set_updated_at()`; gatilhos.
- [ ] Tipos TypeScript gerados; `../dados/modelo-de-dados.md` e `../dados/changelog-do-schema.md` atualizados.

### C. Testes de RLS
- [ ] Usuários fictícios A e B + anônimo; matriz completa por tabela/operação; teste de FK cruzada.
- [ ] Teste que falha se surgir tabela em `public` sem cobertura.
- [ ] Security Advisor sem erros.

### D. Autenticação
- [ ] Google Cloud: projeto, tela de consentimento, escopos mínimos, cliente web; segredo só no painel do Supabase.
- [ ] Supabase Auth: Google (PKCE), e-mail + senha (confirmação, recuperação, política de senha, senhas vazadas se disponível), Turnstile, redirect allowlist exata, confirmação de e-mail, rotação de refresh, limites revisados.
- [ ] Telas: entrar/criar conta, digitar código, callback, erros com mensagens anti-enumeração.
- [ ] Sessão: armazenamento (avaliar adaptador IndexedDB), eventos de login/logout, guard de rotas.
- [ ] Sair (este aparelho) e sair de todos.

### E. Primeiro acesso
- [ ] Textos provisórios de Termos e Privacidade (versão `draft`), aceite → `consent_records` (maioridade é cláusula dos Termos, ADR-0010).
- [ ] Bloqueio do app até o aceite.

### F. Meus dados
- [ ] `export-data` (JWT, limite 3/dia) → arquivo JSON legível.
- [ ] `delete-account` (JWT + código de confirmação) → exclusão no Auth + cascata + limpeza local.
- [ ] `account-deletion-request` (página pública com confirmação por e-mail) — exigência das lojas.

### G. Camada de dados no app
- [ ] `core/data`: cliente Supabase, repositórios, TanStack Query, esqueleto da fila de sincronização.

### H. Produção
- [ ] Criar `papeai-prod` (São Paulo), aplicar migrações, configurar Auth igual ao dev (com URLs de produção).

## Segurança nesta fase
Seção F02 do checklist (RLS, grants, funções seguras, chave secreta só em funções, PKCE, Turnstile, anti-enumeração, exclusão completa).

## Testes e verificações
- Testes de RLS verdes (saída no relatório).
- Security Advisor: print/saída.
- E2E: login por código (com e-mail de teste do Supabase dev), primeiro acesso, exportar, excluir.
- Manual: tentar ler dados de B logado como A (via console do navegador) → 0 linhas.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| SMTP padrão do Supabase com limite baixo | Usar só para testes; SMTP próprio na F09 |
| Google OAuth em modo "Testing" só aceita usuários de teste | Cadastrar e-mails de teste; publicar na F09/F11 |
| Projeto dev pausar por inatividade | Normal; reativar no painel |
| Esquecer RLS em tabela nova | Teste que falha por cobertura + checklist de migração |

## O que você vai aprender
- SQL básico (tabelas, colunas, chaves estrangeiras).
- O que é RLS e por que ele protege mais do que o código do app.
- Como funciona "Entrar com Google" (OAuth + PKCE) e o que é um JWT.

## Portão de aprovação F02
**Critérios:**
- [ ] Login com Google e com código funcionando em dev e prod.
- [ ] Primeiro acesso exige termos/privacidade e registra consentimento.
- [ ] Testes de RLS cobrindo todas as tabelas, verdes; Security Advisor sem erros.
- [ ] Exportar e excluir conta funcionando (inclusive limpeza local).
- [ ] Documentos de dados e changelog atualizados.

**Roteiro de teste do dono (20 min):**
1. Crie conta com Google; aceite os termos; veja seu perfil.
2. Saia; entre com e-mail + código.
3. Exporte seus dados e abra o JSON.
4. Peça à IA a demonstração "usuário A tentando ler dados do B" e veja o resultado vazio.
5. Exclua a conta de teste e confirme que não consegue mais entrar com ela.
6. Diga **"aprovado F02"** ou o que precisa mudar.
