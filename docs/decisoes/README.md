# Decisões de arquitetura (ADRs)

Uma ADR registra **uma** decisão: contexto, opções, escolha e consequências. Decisão mudou? **Não editar o mérito** de uma ADR aceita — criar outra que a substitui e marcar a antiga como "Substituída por ADR-XXXX".

> Nas ADRs, os caminhos citados em "Documentos afetados" são relativos à pasta `docs/` (ex.: `fases/F01` = `docs/fases/F01-...md`).

## Índice
| ADR | Título | Status | Decidir em |
|---|---|---|---|
| [0001](ADR-0001-web-primeiro-pwa-capacitor.md) | Web primeiro (PWA) + Capacitor para mobile | Aceita | F00 |
| [0002](ADR-0002-supabase-como-backend.md) | Supabase como backend (região São Paulo) | Aceita | F00 |
| [0003](ADR-0003-byok-chave-somente-no-dispositivo.md) | BYOK: chave somente no dispositivo, chamada direta ao provedor | Aceita | F00 |
| [0004](ADR-0004-hospedagem-cloudflare-e-origens-separadas.md) | Hospedagem Cloudflare e origens separadas (site x app) | Aceita | F00 |
| [0005](ADR-0005-licenca-codigo-conteudo-e-marca.md) | Licença do código, do conteúdo e da marca | Aceita | F00 |
| [0006](ADR-0006-login-google-e-email-senha.md) | Login com Google + e-mail e senha | Aceita | F00 |
| [0007](ADR-0007-voz-local-primeiro-byok-opcional.md) | Voz local primeiro, provedores em nuvem opcionais via BYOK | Proposta | F07 (após benchmark) |
| [0008](ADR-0008-modelos-claude-e-perfis-de-qualidade.md) | Modelos Claude e perfis de qualidade | Proposta | F04 (após evals) |
| [0009](ADR-0009-conteudo-curado-mais-geracao-validada.md) | Conteúdo curado no repositório + geração por IA validada | Aceita | F00 |
| [0010](ADR-0010-idade-minima-18.md) | Maioridade só nos Termos (sem perguntar idade) | Aceita com ajuste | F00 |
| [0011](ADR-0011-dados-sensiveis-no-aparelho.md) | Dados sensíveis ficam no aparelho por padrão | Aceita | F00 |
| [0012](ADR-0012-componentes-nativos-sem-radix.md) | Componentes de interface nativos, sem shadcn/Radix | Aceita | F01 |

## Modelo
```markdown
# ADR-NNNN — <título>
- **Status:** Proposta | Aceita | Rejeitada | Substituída por ADR-XXXX
- **Data:** AAAA-MM-DD (proposta) · AAAA-MM-DD (aceita)
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** IDs

## Contexto
## Opções consideradas
## Decisão
## Consequências
## Quando revisitar
## Documentos afetados (atualizar se esta ADR mudar)
```
