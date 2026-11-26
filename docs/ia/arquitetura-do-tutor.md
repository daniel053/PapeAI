# Arquitetura do tutor (IA)

> **Antes de escrever código que chama o Claude:** carregar a skill `claude-api` e confirmar nas docs oficiais os nomes exatos de parâmetros e helpers do SDK TypeScript. Fatos abaixo verificados na skill em 2026-11-26 (tabela de modelos com cache de 2026-11-03).

## Fatos da API que moldam o desenho
| Fato | Consequência no PapeAI |
|---|---|
| Nos modelos atuais, **não existem** `temperature`, `top_p`, `top_k` (retornam erro 400 na versão de API atual) | Consistência vem de prompt claro + schema + `effort`, não de "temperatura baixa" |
| **Prefill** (começar a resposta pelo assistente) retorna 400 | Formato garantido por **structured outputs** (`output_config.format`) |
| `budget_tokens` foi removido/rejeitado nos modelos atuais | Profundidade controlada por `output_config.effort` (`low` … `max`) |
| Thinking: Opus 5.5 não permite desligar; Sonnet 5.5 desliga com `thinking: {type: "between_tools"}` (effort ≤ high); Haiku 5.5 permite `disabled` com effort ≤ high | Rotas de conversa usam effort `low`; medir latência e custo por perfil |
| `stop_reason: "refusal"` pode ocorrer (HTTP 200) | Sempre checar `stop_reason` antes de ler o conteúdo; mensagem amigável |
| Fallback no servidor (`fallbacks: "default"` + beta `server-side-fallback-2026-07-01`) disponível para Sonnet 5.5/Opus 5.5; Haiku 5.5 não tem | Avaliar na F03; se ativado, informar no app que outro modelo pode responder |
| Mensagens `{role: "system"}` no meio da conversa (Opus 5.5, Sonnet 5.5, Haiku 5.5) | Trocar o modo do professor no meio da lição **sem** invalidar o cache do prompt |
| Cache de prompt: até 4 marcadores; prefixo mínimo cacheável varia por modelo (512–4096 tokens) | Parte fixa do prompt primeiro; confirmar `usage.cache_read_input_tokens > 0` |
| `GET /v1/models` não gasta tokens | Validar chave e descobrir modelos disponíveis |
| `POST /v1/messages/count_tokens` | Estimar custo antes de chamadas grandes (ex.: geração de lição) |
| SDK faz até 2 novas tentativas por padrão (429/5xx/rede) | **Não** empilhar novas tentativas próprias por cima (multiplicaria custo) |
| Na web o SDK exige `dangerouslyAllowBrowser: true` | Coberto pelo desenho BYOK (`../seguranca/cofre-da-chave-api.md`) |

## Rotas de chamada (cada uma com configuração própria em `app/src/config/llm-routes.ts`)
| Rota | Para quê | Streaming | Saída | Effort inicial | `max_tokens` inicial | Fase |
|---|---|---|---|---|---|---|
| `tutor.turn` | Turno de conversa/roleplay | Sim | `TutorTurn` | low | 1.500 | F04 |
| `summary.rolling` | Resumo da conversa a cada N turnos | Não | `ConversationSummary` | low | 600 | F04 |
| `memory.update` | Atualizar "o que o tutor sabe" ao fim da sessão | Não | `MemoryDelta` | low | 800 | F04 |
| `placement.turn` | Entrevistar e avaliar um turno do nivelamento | Sim (só a fala) | `PlacementTurn` | medium | 1.500 | F05 |
| `lesson.generate` | Gerar atividades de uma lição dentro de uma especificação | Não | `LessonContent` | medium | 6.000 | F06 |
| `writing.correct` | Corrigir um texto escrito | Não | `WritingFeedback` | medium | 3.000 | F06 |
| `speech.explain` | Explicar ao aluno as evidências **medidas** da fala | Sim | `SpeechFeedback` | low | 1.000 | F07 |
| `content.culture_note` | Nota cultural a partir de fatos curados | Não | `CultureNote` | low | 800 | F06 |

Os valores de effort/`max_tokens` são **pontos de partida**: ajustados na F04/F06 com medições reais (latência, custo, qualidade nas evals).

### Modelos por perfil de qualidade (ADR-0008)
| Perfil | Modelo | Preço (US$/1M tokens entrada/saída) |
|---|---|---|
| Econômico | `claude-haiku-5-5` | 0,10 / 0,50 (prompts até 100K) |
| Equilibrado | `claude-sonnet-5-5` | 2,00 / 10,00 |
| Máximo | `claude-opus-5-5` | 4,00 / 20,00 |

IDs de modelo ficam **só** em `app/src/config/models.ts` e são conferidos na inicialização via `GET /v1/models` (se um modelo sumir, o app avisa e oferece outro). O **padrão** é decidido pelo dono no portão F04, com base nas evals.

## Camadas do prompt (ordem = ordem do cache)
```text
[1] system: núcleo fixo       → papel, regras de segurança, regras de correção, formato   ┐ estável
[2] system: persona + modo    → personalidade do mascote + modo de feedback (gentil...)    │ (cache 1)
[3] system: pacote do idioma  → variante (en-US/en-AU), regras de variante, L1 do aluno    ┘
[4] perfil do aluno           → nível, objetivos, memória do tutor (resumida)             ┐ muda pouco
[5] contexto da lição         → objetivos, vocabulário-alvo, ponto gramatical, tema       ┘ (cache 2)
[6] resumo da conversa        → gerado por summary.rolling
[7] últimos turnos literais   → no máximo ~8
[8] entrada atual             → texto do aluno (+ SpeechEvidence, se houver fala)
```
- Nada volátil (data/hora, IDs aleatórios) nas camadas 1–5 — isso quebraria o cache.
- Troca de modo no meio da lição → mensagem `{role: "system"}` acrescentada ao fim, em vez de editar a camada 2.
- Prompts vivem em arquivos versionados: `app/src/core/tutor/prompts/tutor.v1.md` etc. O `prompt_version` é registrado em cada resultado.

## Schema da resposta do tutor (`TutorTurn`) — contrato inicial
```ts
// app/src/core/tutor/schemas.ts — esboço (F04)
const Correction = z.object({
  original: z.string().min(1).max(200),      // DEVE ser trecho literal da mensagem do aluno
  suggestion: z.string().min(1).max(200),
  category: z.enum(['grammar','vocabulary','spelling','word_order','register','naturalness','punctuation']),
  severity: z.enum(['minor','major']),
  explanation: z.string().max(400),          // no idioma de explicação configurado
  confidence: z.enum(['high','medium','low']),
});

export const TutorTurn = z.object({
  reply: z.string().min(1).max(1200),        // no idioma-alvo, ajustado ao nível
  reply_hint_native: z.string().max(400).optional(), // ajuda curta no idioma nativo (iniciantes)
  corrections: z.array(Correction).max(5),
  new_vocabulary: z.array(z.object({
    term: z.string().max(80), meaning: z.string().max(200), example: z.string().max(300),
  })).max(5),
  mascot_emotion: z.enum(['neutral','happy','excited','thinking','encouraging','surprised','disappointed','proud']),
  next_action: z.enum(['continue','end_activity','offer_hint','explain_in_native']),
  learner_signals: z.object({
    distress: z.boolean(),                   // frustração/angústia percebida → suavizar
    switched_language: z.boolean(),          // aluno respondeu em português
  }),
});
```
O mesmo JSON Schema vai para `output_config.format`; o zod revalida no aparelho (defesa em profundidade).

## Pipeline de validação (toda resposta)
```text
1. stop_reason == "refusal"?          → mensagem amigável + log local (sem conteúdo sensível)
2. stop_reason == "max_tokens"?       → resposta truncada: uma nova tentativa com max_tokens maior, senão fallback
3. JSON válido no schema (zod)?       → senão: 1 nova tentativa; depois, fallback "Não entendi, pode repetir?"
4. Para cada correção: `original` é trecho literal (normalizado) da mensagem do aluno?
                                       → senão: DESCARTAR a correção (anti-alucinação) e contar no log local
5. Correção que "corrige" para o mesmo texto ou só muda variante regional válida? → descartar
6. Renderizar `reply` com Markdown restrito (sem HTML, sem imagens, links como texto)
7. Mascote recebe `mascot_emotion`; trilha recebe `new_vocabulary` (para virar cartões SRS)
8. Registrar uso de tokens (usage.*) no usage_ledger local
```
Normalização para conferir citações: minúsculas, espaços colapsados, aspas/apóstrofos tipográficos → simples. **Não** remove pontuação nem desfaz contrações.

## Memória do tutor
| Nível | O que é | Onde | Quem edita |
|---|---|---|---|
| Turnos recentes | Últimas ~8 trocas literais | Memória + IndexedDB | — |
| Resumo da conversa | Parágrafo atualizado a cada ~8 turnos (`summary.rolling`) | IndexedDB | — |
| Memória de longo prazo | Fatos curtos: erros recorrentes, pontos fortes, interesses, contexto | `learner_memory` (servidor) | **Usuário** vê/edita/apaga; tutor propõe via `memory.update` |

Regras:
- O tutor só "lembra" o que estiver nas camadas do prompt. Se o aluno perguntar algo que não está lá, o tutor diz que não lembra — **nunca inventa** memória.
- `memory.update` só cria fato com **evidência** (citação do aluno) e incrementa `evidence_count` em fatos repetidos.
- Fatos sensíveis (saúde, religião, política, documentos) **não** são memorizados.

## Tratamento de erros da API
| Erro | O que o usuário vê | Ação |
|---|---|---|
| 401 (chave inválida/revogada) | "Sua chave não foi aceita. Confira ou cole outra." | Leva à tela da chave |
| Saldo insuficiente | "Sua conta da API está sem créditos." + link para a cobrança da Console | — |
| 403 | "Sua chave não tem permissão para este modelo." | Sugere outro perfil |
| 404 (modelo) | "Este modelo não está disponível." | Atualiza a lista via `/v1/models` |
| 429 (limite de taxa) | "Muitas mensagens em pouco tempo; aguardando…" | Respeita `retry-after`; sem laços |
| 5xx/529 (sobrecarga) | "A IA está ocupada; tentando de novo…" | Novas tentativas do SDK (máx. 2) |
| Rede | "Sem conexão." | Botão "tentar de novo" |
| Orçamento do app atingido | "Você atingiu o limite que definiu." | Ajustar em Configurações |

Erros são tratados por **classe tipada** do SDK (do mais específico ao mais geral), nunca por texto da mensagem.

## Segurança do conteúdo
- O texto do aluno é **dado**, não instrução: o núcleo do prompt manda manter o papel de tutor mesmo que o texto peça outra coisa.
- Sinais de angústia (`learner_signals.distress`) → o modo muda para gentil naquela sessão; se houver menção a risco de vida, o tutor responde com cuidado e indica ajuda (no Brasil, CVV — 188). Esse texto é fixo e revisado pelo dono.
- Regras específicas do modo sem filtro: `personalidade-e-modos-de-feedback.md`.
- Controle de alucinação: `controle-de-alucinacao-do-tutor.md`.
