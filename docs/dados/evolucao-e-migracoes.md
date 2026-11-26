# Evolução das estruturas de dados (migrações)

> Como mudar o banco **sem quebrar** usuários existentes e sem perder dados. Vale para o Postgres (Supabase), para o IndexedDB local e para os arquivos de conteúdo.

## Regras invioláveis
1. **Nunca editar uma migração já aplicada** (em qualquer ambiente). Erro numa migração → nova migração corrigindo.
2. **Toda mudança de schema** = migração nova + `modelo-de-dados.md` + `changelog-do-schema.md` **no mesmo commit**.
3. **Toda tabela nova** nasce com RLS, grants explícitos, políticas, índice em `user_id` e teste de RLS.
4. **Primeiro no projeto de desenvolvimento**, depois em produção — nunca o contrário.
5. **Mudanças destrutivas** (remover/renomear coluna, mudar tipo) usam o padrão **expandir → migrar → contrair**, em releases separados.
6. Migração que mexe em dados de usuário precisa de **plano de reversão por escrito** no PR (o plano gratuito do Supabase não tem restauração ponto-no-tempo).

## Ambientes
| Ambiente | Onde | Para quê |
|---|---|---|
| Local (opcional) | Supabase CLI + Docker | Testar migrações e RLS sem internet (se Q-13 = sim) |
| Desenvolvimento | Projeto Supabase gratuito nº 1 | Desenvolvimento diário, dados fictícios |
| Produção | Projeto Supabase gratuito nº 2 (região São Paulo) | Usuários reais |

## Fluxo de uma mudança de schema
```text
1. Descrever a mudança no doc da fase (o quê e por quê).
2. supabase migration new <descricao_curta_em_ingles>
      → cria supabase/migrations/<timestamp>_<descricao>.sql
3. Escrever o SQL (com RLS/grants/políticas/índices/checks).
4. Aplicar no ambiente de desenvolvimento (local: supabase db reset | nuvem: supabase db push).
5. Gerar tipos: supabase gen types typescript → app/src/core/data/database.types.ts
6. Rodar testes de RLS + testes do app.
7. Conferir o Security Advisor do Supabase (zero erros).
8. Atualizar modelo-de-dados.md + changelog-do-schema.md.
9. PR → CI verde → aprovação do dono → merge.
10. Aplicar em produção (supabase db push no projeto de produção), conferir, registrar no changelog.
```
> Comandos exatos do Supabase CLI são confirmados na documentação oficial quando a F02 começar (regra anti-alucinação).

## Padrão expandir → migrar → contrair (exemplo: renomear `notes` para `details`)
| Etapa | Release | Ação |
|---|---|---|
| Expandir | N | Adicionar `details` (nullable). O app grava nas duas colunas e lê de `details` com fallback para `notes`. |
| Migrar | N | Migração de dados: `update ... set details = notes where details is null` (em lotes, se grande). |
| Contrair | N+1 (após todos os clientes atualizados) | Remover `notes`. |

Importante para mobile: versões antigas do app continuam instaladas por semanas. **Nunca** remover algo que uma versão ainda suportada usa.

## Mudanças em enums
- Adicionar valor: `alter type ... add value 'x'` (seguro).
- Remover valor: criar novo tipo, migrar colunas, trocar, apagar o antigo (expandir → contrair).

## IndexedDB (local)
- Cada mudança = `db.version(n+1).stores(...).upgrade(tx => ...)` no Dexie.
- Nunca apagar dados do usuário numa atualização sem migrá-los.
- Testes unitários com `fake-indexeddb` (avaliar na F03) cobrindo a atualização da versão anterior.
- Registrar na seção "Local" do `changelog-do-schema.md`.

## Conteúdo versionado (`content/`, prompts)
- Lições têm `lesson_key` estável. Mudar o conteúdo de uma lição **não** muda a chave; remover uma lição exige mapear progresso para a substituta.
- Prompts são arquivos versionados (`tutor.v1.md` → `tutor.v2.md`). O app grava `prompt_version` nos resultados para rastrear qualquer problema.
- Mudança de prompt passa pelas evals (`../ia/avaliacoes-de-prompts-evals.md`).

## Checklist de revisão de uma migração (no PR)
- [ ] Migração nova (nenhuma antiga editada).
- [ ] RLS ativo + políticas + grants explícitos em tabelas novas.
- [ ] FKs compostas onde houver relação entre tabelas de usuário.
- [ ] `check` de tamanho/formato nas colunas de texto.
- [ ] Índices para as consultas e para `user_id`.
- [ ] Funções `security definer` com `set search_path = ''`, checagem do chamador e `revoke execute ... from public, anon`.
- [ ] Nada destrutivo sem expandir/contrair.
- [ ] Tipos TypeScript regenerados.
- [ ] Docs de dados e changelog atualizados.
- [ ] Testes de RLS passando.
