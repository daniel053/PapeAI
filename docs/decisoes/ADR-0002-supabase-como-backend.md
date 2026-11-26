# ADR-0002 — Supabase como backend (região São Paulo)
- **Status:** Aceita (2026-11-26)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** CON-01..13, SEG-01, SEG-11, PRIV-07, RNF-01

## Contexto
Precisamos de login (incluindo Google), banco para progresso, funções de servidor (excluir conta, e-mails) e tarefas agendadas — de graça no início. O dono já ouviu falar do Supabase e perguntou se funciona com mobile.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **A. Supabase** | Postgres (SQL), **RLS** nativo, Auth com Google/OTP, Edge Functions, `pg_cron`, plano gratuito (50 mil usuários ativos/mês, 500 MB), região São Paulo, código aberto, funciona igual na web e no app Capacitor | Projeto gratuito pausa após 7 dias sem uso; limites de banco/tráfego; backups limitados no gratuito |
| B. Firebase | Plano gratuito existe; maduro | Banco NoSQL e regras próprias; maior dependência do fornecedor |
| C. Appwrite Cloud | Código aberto | Ecossistema menor |
| D. PocketBase/servidor próprio | Controle total | Precisa de servidor (custo e manutenção) |

## Decisão
**Supabase**, com dois projetos (dev e prod) e o de produção na região **São Paulo**. O site/app é hospedado em outro serviço (o Supabase não hospeda o frontend — ADR-0004).

**Resposta à dúvida do dono:** sim, funciona com mobile — o mesmo cliente `supabase-js` roda no app Capacitor; o APK sai do Android Studio (F10), independentemente do Supabase.

## Consequências
- ➕ Segurança por RLS no próprio banco (protege mesmo se o app tiver bug).
- ➕ SQL e migrações versionadas no Git.
- ➖ Monitorar limites e pausa (alertas em `arquitetura/custos-e-limites.md`).
- ➖ Mudanças do Supabase (sistema de chaves, grants explícitos) precisam ser confirmadas na F02.

## Quando revisitar
Ao aproximar dos limites do plano gratuito ou se uma mudança de preço/política inviabilizar o uso.

## Documentos afetados
`dados/*`, `seguranca/supabase-rls-e-backend.md`, `seguranca/autenticacao-e-sessoes.md`, `fases/F02`.
