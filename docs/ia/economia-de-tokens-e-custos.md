# Economia de tokens e custos

> Quem paga é o **usuário**, direto à Anthropic, com a própria chave. Nosso dever: gastar pouco, mostrar tudo e nunca surpreender.

## Preços de referência (Anthropic, primeira parte — tabela da skill `claude-api`, cache de 2026-11-03)
| Modelo | Entrada (US$/1M) | Saída (US$/1M) | Leitura de cache (US$/1M) | Observação |
|---|---|---|---|---|
| `claude-haiku-5-5` | 0,10 | 0,50 | — (confirmar) | Prompts até 100K tokens; acima disso 0,50 / 2,50 |
| `claude-sonnet-5-5` | 2,00 | 10,00 | 0,10 | |
| `claude-opus-5-5` | 4,00 | 20,00 | 0,20 | Thinking não pode ser desligado (usar effort baixo) |

- Tokens de **thinking** são cobrados como saída.
- Escrita no cache custa um pouco **mais** que entrada normal (multiplicador conforme a duração do cache — confirmar na página de preços na F03).
- Preços mudam: o app lê a tabela de `app/src/config/pricing.ts`, versionada, com data e fonte. A IA atualiza a tabela quando houver mudança (com fonte).

## Estimativa de uma lição (fórmula + exemplo)
**Fórmula por turno:**
`custo = (entrada_sem_cache × preço_entrada) + (leitura_cache × preço_cache) + (escrita_cache × preço_escrita) + (saída + thinking) × preço_saída`

**Premissas do exemplo** (a medir de verdade na F03/F04): 20 turnos; parte fixa do prompt (camadas 1–5) ≈ 2.500 tokens; histórico + resumo + mensagem ≈ 1.500 tokens; saída JSON ≈ 300 tokens; thinking mínimo; escrita de cache ≈ 1,25× a entrada.

| Perfil | Custo estimado por lição de ~15 min | 30 lições/mês |
|---|---|---|
| Econômico (Haiku 5.5) | ≈ US$ 0,01 | ≈ US$ 0,35 |
| Equilibrado (Sonnet 5.5) | ≈ US$ 0,13 | ≈ US$ 4 |
| Máximo (Opus 5.5) | ≈ US$ 0,26 + thinking | ≈ US$ 8+ |

> ⚠️ Estimativas para planejamento, **não** promessas. Se o prefixo fixo for menor que o mínimo cacheável do modelo, o cache não ativa e o custo sobe. O app mostra o **custo real estimado** a partir do campo `usage` de cada resposta.

## Estratégias (em ordem de impacto)
| # | Estratégia | Como | Fase |
|---|---|---|---|
| 1 | **Zero tokens para o que o código faz** | 3D, revisão espaçada, notas, métricas de fala, sequência: tudo local | sempre |
| 2 | **Cache de prompt** | Camadas estáveis primeiro; conferir `cache_read_input_tokens` | F03/F04 |
| 3 | **Histórico curto + resumo** | ~8 turnos literais + resumo rolante | F04 |
| 4 | **Saída estruturada e enxuta** | JSON com limites de tamanho por campo | F04 |
| 5 | **Effort por rota** | `low` para conversa; `medium` para avaliação/geração; medir antes de subir | F04 |
| 6 | **`max_tokens` por rota** | Teto por tipo de chamada (`arquitetura-do-tutor.md`) | F03 |
| 7 | **Cache local de lições** | Lição gerada é guardada e reaproveitada | F06 |
| 8 | **Perfis de qualidade** | Usuário escolhe Econômico/Equilibrado/Máximo vendo o custo | F03 |
| 9 | **Contagem antes de chamadas grandes** | `count_tokens` antes de gerar lições longas | F06 |
| 10 | **Batch para o que não é tempo real** | Ex.: gerar lições da semana com desconto (backlog BL-10) | F12 |
| 11 | **Mensagem de sistema no meio da conversa** | Trocar modo sem invalidar o cache | F04 |
| 12 | **Novas tentativas limitadas** | Só as do SDK (máx. 2); nada de laços próprios | F03 |

## Guarda de orçamento (BYOK-12)
| Limite | Padrão | Comportamento |
|---|---|---|
| Diário (US$) | definido no onboarding (sugestão por perfil) | Aviso em 80%; bloqueio em 100% com opção "liberar só hoje" |
| Mensal (US$) | idem | Aviso em 80%; bloqueio em 100% |
| Por sessão (tokens) | teto técnico por rota | Encerra a atividade com resumo |
- O bloqueio do app é uma **ajuda**; a proteção real é o **limite de gasto na Console** — o app ensina a configurá-lo (BYOK-01).
- Os gastos são **estimados** pelo app; o valor oficial é o da Console.

## Painel de consumo (BYOK-11)
- Hoje / semana / mês: tokens de entrada, saída, cache e custo estimado (US$; conversão para R$ com cotação informada pelo usuário — sem chamar serviço externo).
- Por recurso: conversa, nivelamento, lições, correção de escrita, voz.
- Por modelo.
- Exportar CSV (local).
- Fonte dos dados: `usage_ledger` local (nunca vai ao servidor).

## Para o desenvolvimento (custo do dono)
- Iterar prompts aqui no **Claude Code** (coberto pela assinatura) antes de gastar API.
- Evals pequenas e baratas primeiro (Haiku), e só então nos modelos maiores — sempre com **aprovação prévia do custo** (`avaliacoes-de-prompts-evals.md`).
- Chave de dev com limite de gasto baixo na Console.
