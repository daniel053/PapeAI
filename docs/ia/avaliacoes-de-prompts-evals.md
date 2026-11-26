# Avaliações de prompts (evals)

> **Regra:** nenhuma mudança de prompt, modelo, effort ou schema entra sem rodar as evals afetadas e comparar com a versão anterior. Toda rodada gasta créditos reais → **o dono aprova o custo antes**.

## Estrutura
```text
evals/
├─ README.md                 # como rodar, custo estimado por suíte
├─ suites/
│  ├─ corrections/           # frases com erro + gabarito; frases corretas (negativos)
│  ├─ variants/              # en-US x en-GB x en-AU (não são erros)
│  ├─ placement/             # transcrições sintéticas rotuladas por nível
│  ├─ mode-compliance/       # gentil/equilibrado/sem filtro seguem as regras?
│  ├─ culture-hedging/       # perguntas de visto/leis/preços → deve se recusar a afirmar
│  ├─ speech-grounding/      # SpeechEvidence → não pode citar problema ausente
│  ├─ memory-honesty/        # perguntas sobre o que não está na memória
│  └─ lesson-validity/       # lições geradas passam no validador?
├─ runner/                   # script que chama a API com a chave de DEV
└─ results/                  # resultados versionados: suíte, prompt_version, modelo, data, custo
```

## Formato de um caso (exemplo: correções)
```json
{
  "id": "corr-0042",
  "learner_level": "a2",
  "variant": "en-US",
  "input": "Yesterday I go to the market and buyed apples.",
  "expected_corrections": [
    { "original": "go", "suggestion": "went", "category": "grammar" },
    { "original": "buyed", "suggestion": "bought", "category": "grammar" }
  ],
  "must_not_flag": ["market", "apples"]
}
```
Casos negativos (frases corretas) têm `expected_corrections: []` — são os mais importantes (H1).

## Como avaliamos
1. **Checagens determinísticas primeiro:** schema válido, citações literais, contagem de correções, presença/ausência de termos, idioma da resposta.
2. **Comparação com gabarito:** precisão e recall das correções; falsos positivos nos negativos.
3. **Juiz-IA só quando necessário** (ex.: "o tom do sem filtro atacou a pessoa?"), com rubrica fechada e amostra revisada pelo dono.
4. **Revisão humana:** o dono lê uma amostra de cada rodada (10–20 casos).

## Metas iniciais (calibrar na F04)
| Suíte | Métrica | Meta |
|---|---|---|
| corrections | Falsos positivos em frases corretas | < 5% |
| corrections | Recall de erros "major" | > 85% |
| todas | Schema válido | 100% (após 1 nova tentativa) |
| placement | Nível dentro de ±1 subnível do rótulo | > 80% |
| mode-compliance | Violação das regras do sem filtro | 0 |
| speech-grounding | Comentário sem evidência | 0 |
| culture-hedging | Afirmação de lei/visto/preço | 0 |

## Origem dos casos
- Escritos com ajuda da IA **aqui no Claude Code** (sem custo de API), revisados pelo dono.
- Erros típicos de brasileiros (`../pedagogia/metodologia.md`) viram casos.
- Relatos "correção errada" (com consentimento) viram casos novos.
- Nunca usar conversas reais de usuários sem consentimento explícito.

## Rodada de eval — protocolo
1. A IA estima o custo (casos × tokens × preço) e pede aprovação: "Rodar `corrections` (120 casos) no Sonnet 5.5 ≈ US$ X. Aprovar?"
2. Roda com a chave de **desenvolvimento** (nunca a de um usuário).
3. Salva o resultado em `evals/results/<data>-<suite>-<prompt_version>-<modelo>.json`.
4. Compara com a rodada anterior e escreve um resumo no relatório do portão.
5. Piorou em alguma métrica-chave → a mudança não entra.

## Comparação entre perfis (para a decisão da ADR-0008)
No portão F04, rodar as suítes principais nos três perfis e montar a tabela qualidade × custo × latência. O dono escolhe o padrão com esses números.
