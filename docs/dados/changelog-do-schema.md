# Changelog do schema

> Registro de **toda** mudança estrutural de dados — servidor (Postgres), local (IndexedDB) e conteúdo com impacto em dados. Entradas mais novas no topo.

## Modelo de entrada
```markdown
### AAAA-MM-DD — <título curto> (Fase FNN)
- **Ambiente(s):** dev | prod | local
- **Migração:** `supabase/migrations/<arquivo>.sql`  (ou: Dexie versão N → N+1)
- **O que mudou:** tabelas/colunas/políticas/funções
- **Por quê:** requisito (ex.: OBJ-02) ou ADR
- **Compatibilidade:** quebra? (expandir/contrair?) versões do app afetadas
- **Reversão:** como desfazer
- **Verificação:** testes de RLS ok? Security Advisor ok?
```

## Servidor (Postgres / Supabase)
_Nenhuma migração aplicada ainda._ Primeira versão planejada: **v0** na F02 (`profiles`, `learning_profiles`, `languages`, `language_variants`, `notification_preferences`, `consent_records`, gatilhos e funções privadas).

## Local (IndexedDB)
_Nenhuma versão criada ainda._ Primeira versão planejada: **v1** na F03 (cofre separado) e F04 (conversas, uso de tokens).

## Conteúdo com impacto em dados
_Nenhuma entrada ainda._
