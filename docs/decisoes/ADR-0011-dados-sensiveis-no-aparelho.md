# ADR-0011 — Dados sensíveis ficam no aparelho por padrão
- **Status:** Proposta
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** PRIV-02, PRIV-03, NIV-09, VOZ-09, BYOK-06

## Contexto
Conversas com o tutor podem conter detalhes da vida da pessoa; áudio é dado pessoal; o uso de tokens revela hábitos. Guardar isso no servidor aumentaria o risco e as obrigações (LGPD) sem ganho pedagógico essencial.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **Sensíveis só no aparelho; servidor guarda progresso estruturado** | Menos risco, menos obrigações, coerente com BYOK | Trocar de aparelho não leva o histórico de conversas |
| Tudo sincronizado no servidor | Conveniência multi-aparelho | Risco e responsabilidade altos |
| Sincronização opcional cifrada de ponta a ponta | Melhor dos dois mundos | Complexa — fica para depois (BL-04) |

## Decisão (proposta)
| Fica **só no aparelho** | Vai para o **servidor** |
|---|---|
| Chave de API, transcrições das conversas e do nivelamento, áudio, uso de tokens, cache de lições | Perfil mínimo, objetivos, nível e evidências curtas, progresso, vocabulário (SRS), memória resumida do tutor (visível/editável), preferências, consentimentos |

## Consequências
- ➕ Vazamento do banco não exporia conversas nem áudio.
- ➕ Menos dados = menos obrigações e menos custo.
- ➖ Histórico de conversas não acompanha o usuário em outro aparelho (comunicado de forma clara).

## Quando revisitar
Quando houver demanda por sincronização (F12.9), sempre com cifra de ponta a ponta e opt-in.

## Documentos afetados
`dados/armazenamento-local.md`, `dados/modelo-de-dados.md`, `seguranca/privacidade-lgpd.md`.
