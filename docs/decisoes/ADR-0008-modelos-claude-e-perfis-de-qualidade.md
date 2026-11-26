# ADR-0008 — Modelos Claude e perfis de qualidade
- **Status:** Proposta (o **padrão** é decidido no portão F04, com as evals)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** BYOK-11, BYOK-14, TUT-*, DEV-06

## Contexto
Quem paga os tokens é o **usuário final**. Modelos diferentes trazem custo, latência e qualidade diferentes. Preços (tabela da skill `claude-api`, cache de 2026-11-03), em US$ por milhão de tokens (entrada/saída): Haiku 5.5 — 0,10/0,50; Sonnet 5.5 — 2,00/10,00; Opus 5.5 — 4,00/20,00. Fable 5.2 (8/40) fica fora: caro demais para conversa diária.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| Modelo único fixo | Simples | Ignora o bolso e a preferência do usuário |
| **Perfis escolhidos pelo usuário + padrão definido por evals** | Transparente; o usuário decide o custo; qualidade medida | Três configurações para testar |
| Cascata automática (barato → caro) | Economia potencial | Complexa; caches são por modelo; pode piorar a qualidade sem o usuário saber |

## Decisão (proposta)
1. **Três perfis** na interface, com custo estimado por lição:
   - **Econômico** → `claude-haiku-5-5`
   - **Equilibrado** → `claude-sonnet-5-5`
   - **Máximo** → `claude-opus-5-5`
2. **O padrão** é escolhido pelo dono no portão F04 a partir da tabela qualidade × custo × latência das evals. Orientação da skill `claude-api`: o modelo mais capaz com *effort* baixo frequentemente rende melhor que modelos menores — por isso o Opus 5.5 entra na comparação em pé de igualdade; reduzir custo é decisão do dono/usuário, não um rebaixamento silencioso.
3. **Configuração por rota** (effort, `max_tokens`, streaming) em `app/src/config/llm-routes.ts`; IDs de modelo **só** em `app/src/config/models.ts`, conferidos via `GET /v1/models`.
4. Regras da API atual: sem `temperature`/`top_p`/`top_k`, sem prefill, sem `budget_tokens`; saídas estruturadas via `output_config.format`; tratar `stop_reason: "refusal"`.
5. **Fallback no servidor em caso de recusa** (Sonnet 5.5/Opus 5.5, beta): avaliar na F03; se ativado, informar o usuário de que outro modelo pode responder em casos raros.

## Consequências
- ➕ Transparência total de custo; usuário no controle.
- ➕ Escolha do padrão baseada em dados.
- ➖ Prompts precisam funcionar bem nos três modelos (evals por perfil).

## Quando revisitar
Novo modelo ou mudança de preço; evals mostrando que um perfil degradou; feedback de usuários.

## Documentos afetados
`ia/arquitetura-do-tutor.md`, `ia/economia-de-tokens-e-custos.md`, `ia/avaliacoes-de-prompts-evals.md`, `fases/F03`, `fases/F04`.
