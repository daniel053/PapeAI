# Controle de alucinação do tutor (no produto)

> Este documento trata das alucinações **do tutor** diante do aluno. As regras para a IA que **desenvolve** o projeto estão em `../processo/controle-de-alucinacao-no-desenvolvimento.md`.

## Princípio central
**A IA conversa, explica e gera conteúdo. O código mede, calcula e decide.**
Notas, nível, agendamento de revisões, métricas de fala, sequência e XP são calculados por código determinístico e testado. A IA nunca é a fonte de um número que o aluno vai levar a sério.

## Matriz de riscos
| # | Alucinação | Impacto no aluno | Mitigação | Teste |
|---|---|---|---|---|
| H1 | **Corrigir o que estava certo** (falso positivo) | Muito alto: ensina errado e desmotiva | Instrução explícita "na dúvida, não corrija"; campo `confidence`; correções `low` ocultas por padrão; evals com frases corretas como negativos | Eval `corrections.negatives` |
| H2 | Correção citando algo que o aluno **não escreveu** | Alto | Verificação de **citação literal** no código; correção sem citação válida é descartada | Unitário `quote-check` |
| H3 | Explicação gramatical errada | Alto | Categorias fixas; explicação curta; evals com gabarito; botão "correção errada" | Eval `corrections.explanations` |
| H4 | Tratar variante regional como erro (*colour*, *arvo*) | Médio | Variante do aluno no prompt (en-US/en-GB/en-AU); regra "variantes válidas não são erro" | Eval `variants` |
| H5 | Inventar palavra, expressão ou gíria | Médio | Vocabulário-alvo vem do pacote curado; gíria nova só com marcação "informal" e da lista do pacote do país | Eval `slang` |
| H6 | Fato cultural/legal falso (vistos, leis, preços, estatísticas) | Alto | Notas culturais vêm de **fatos curados com fonte**; regra: não afirmar números, leis, prazos, preços; para visto/imigração, só indicar fontes oficiais | Eval `culture.hedging` |
| H7 | **"Ouvir"** o que não foi medido ("sua entonação subiu demais") | Muito alto (promessa central) | O tutor **não recebe áudio**; só o `SpeechEvidence` medido. Regra: comentar apenas o que está nas evidências; sem evidência → não comentar pronúncia | Eval `speech.grounding` |
| H8 | Nível inconsistente no nivelamento | Alto | A IA só estima por turno, com citações; o **agregador em código** decide o nível | Unitário do agregador + eval `placement` |
| H9 | Memória inventada ("como você me contou ontem…") | Médio | Só sabe o que está no prompt; regra de admitir que não lembra; memória visível ao usuário | Eval `memory.honesty` |
| H10 | Exercício com resposta errada ou ambígua | Alto | Validador da lição: gabarito presente nas opções, uma única resposta certa, vocabulário-alvo usado | Unitário `lesson-validator` |
| H11 | Mudar de persona/modo sozinho | Baixo | Modo no system; trocas só via mensagem de sistema do app | Eval `mode.compliance` |
| H12 | Responder em idioma errado para o nível | Médio | Regras de imersão por nível no prompt; validação simples de idioma da resposta (heurística) | Eval `language.level` |

## Técnicas aplicadas
1. **Saída estruturada obrigatória** (`output_config.format` + zod): o tutor não "solta texto"; ele preenche campos com regras.
2. **Verificação de citação literal** (H2): `original` precisa existir no texto do aluno após normalização leve.
3. **Confiança declarada**: correções com `confidence: low` não aparecem por padrão (aparecem como "talvez" se o aluno pedir "mostrar todas").
4. **Separação de papéis**: conversar (`tutor.turn`) ≠ avaliar (`placement.turn`, `writing.correct`) ≠ explicar evidências (`speech.explain`). Cada rota tem regras e schema próprios.
5. **Fatos curados** (H6): `content/themes/country.*/facts.json` com `{ fato, fonte, revisado_em, revisado_por }`. O prompt recebe só esses fatos e a instrução de não ir além deles em assuntos sensíveis.
6. **Aterramento da fala** (H7): o `SpeechEvidence` vem de medição (`../voz/precisao-matematica-e-metricas.md`); a instrução fixa é: *"Você não ouviu o áudio. Use apenas as evidências fornecidas. Se a evidência não mostrar um problema, não o mencione."*
7. **Transparência na tela**: o aluno vê o próprio texto/transcrição e o trecho exato corrigido, destacado.
8. **"Essa correção está errada"** (TUT-09): um toque grava `feedback_reports(kind = wrong_correction)` com a frase, a correção e o `prompt_version` (com consentimento do aluno para anexar o trecho).
9. **Evals antes de qualquer mudança** de prompt ou modelo (`avaliacoes-de-prompts-evals.md`).
10. **Avisos honestos**: "A IA pode errar" visível nas correções; nível = "estimativa".

## Regras do núcleo do prompt (rascunho para a F04)
```text
You are a language tutor. Accuracy beats coverage.
- Only correct something if you are confident it is wrong for the learner's variant (en-US / en-GB / en-AU as given).
- Every correction must quote the learner's exact words in `original`. If you cannot quote it exactly, do not include it.
- Regional variants, informal-but-correct usage and stylistic choices are not errors. Mention them as tips only if helpful.
- Do not state laws, visa rules, prices, dates or statistics. For immigration, work permits or legal matters,
  say you cannot advise and suggest checking the official government website.
- Cultural statements must come from the provided FACTS block; outside it, speak generally and mark it as general knowledge.
- You never hear audio. For pronunciation, use only the SpeechEvidence block. No evidence → no pronunciation comment.
- You only remember what is in this prompt. If asked about something not here, say you don't remember.
```

## Métricas acompanhadas (locais + evals)
| Métrica | Meta inicial (calibrar) |
|---|---|
| Correções descartadas por citação inválida | < 2% das correções |
| Falsos positivos em frases corretas (eval) | < 5% |
| Respostas fora do schema | < 0,5% |
| "Correção errada" reportada por 100 correções | acompanhar tendência |
| Comentários de pronúncia sem evidência (eval) | 0 |
