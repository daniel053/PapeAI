# ADR-0010 — Idade mínima de 18 anos
- **Status:** Proposta
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** PRD-11, CON-06, PRIV-*

## Contexto
Apps de idiomas atraem menores. Porém: (1) o titular de uma chave de API da Anthropic precisa ser maior de idade na Console; (2) dados de crianças e adolescentes têm exigências adicionais na LGPD (art. 14) e no ECA Digital; (3) o modo sem filtro e a conversa aberta com IA pedem cuidados extras com menores.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **18+** | Coerente com o titular da chave; conformidade mais simples | Exclui adolescentes |
| 13+/16+ com consentimento parental | Público maior | Verificação de idade, consentimento parental, regras específicas — complexo para dev solo |

## Decisão (proposta)
**18+**, com autodeclaração no primeiro acesso (registrada em `consent_records` e `profiles.age_confirmed_at`), termos explícitos, classificação etária adequada nas lojas e nenhum marketing direcionado a menores.

## Consequências
- ➕ Conformidade mais simples e coerente com o modelo BYOK.
- ➖ Público adolescente fica de fora (backlog BL-20 para uma versão futura com outra conformidade).

## Quando revisitar
Se houver demanda e capacidade para uma versão com consentimento parental.

## Documentos afetados
`seguranca/privacidade-lgpd.md`, `seguranca/autenticacao-e-sessoes.md`, `fases/F02`, `fases/F10`.
