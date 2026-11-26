# Testes e qualidade

## Pirâmide
| Camada | Ferramenta | O que cobre | Quando roda |
|---|---|---|---|
| Unitário | Vitest | `core/*` (cofre, rede, tutor, agregador, FSRS, métricas de fala), utilitários | Todo PR |
| Componente | Testing Library | Telas e componentes isolados | Todo PR |
| Banco/RLS | Vitest contra projeto dev (ou pgTAP local) | Políticas, grants, funções | PR que toca `supabase/` |
| E2E | Playwright | Fluxos completos + provas de segurança de rede | Todo PR (smoke) / `main` (completo) |
| Acessibilidade | axe (via Playwright) | Telas principais | Todo PR |
| Evals de IA | `evals/` | Qualidade dos prompts | Mudança de prompt/modelo (com aprovação de custo) |
| Manual | Roteiro do dono | Experiência real no aparelho | Todo portão |

## Testes críticos (não podem ser removidos sem ADR)
| Teste | Prova | Fase |
|---|---|---|
| `vault.*` | A chave nunca fica em claro, não há leitura direta, remoção apaga, isolamento por usuário | F03 |
| `e2e.key-only-to-anthropic` | A chave só aparece em requisições para `api.anthropic.com` | F03 |
| `e2e.csp-blocks` | O navegador bloqueia destinos fora da allowlist | F01/F03 |
| `log.redaction` | Padrões de chave saem mascarados | F03 |
| `lint.vault-imports` | Só módulos autorizados importam o cofre | F01/F03 |
| `rls.matrix` | Dono/outro/anônimo em todas as tabelas × operações | F02+ |
| `rls.coverage` | Nenhuma tabela de `public` sem teste | F02+ |
| `tutor.quote-check` | Correções sem citação literal são descartadas | F04 |
| `placement.aggregator` | Convergência, parada, pesos, casos especiais | F05 |
| `fsrs.schedule` | Agendamento em dias simulados | F06 |
| `activity.record` | `record_activity` valida posse e limites | F06 |
| `speech.metrics` | YIN, pausas, WER, DTW, GOP com sinais sintéticos | F07 |
| `e2e.audio-stays-local` | Nenhum áudio vai ao nosso servidor | F07 |
| `assets.mascot-budget` | Orçamento e nomes dos clipes do `.glb` | F08 |
| `email.unsubscribe-hmac` | Token válido/inválido/expirado | F09 |

## Regras
- **API do Claude simulada** em unitários e E2E (respostas válidas, inválidas, recusas, erros 401/429/529). Chave **falsa** com formato válido.
- Nenhum teste usa dados pessoais reais ou chave real.
- Teste instável (*flaky*) → corrigir ou isolar com tarefa registrada; nunca ignorar em silêncio.
- Meta de cobertura: `core/` ≥ 80% de linhas (calibrar); o que importa é cobrir os testes críticos.

## Metas de desempenho (verificadas no portão)
| Métrica | Meta inicial |
|---|---|
| LCP (4G simulado) | < 2,5 s |
| JS inicial (gzip) | ≤ ~250 KB (o 3D e os modelos de voz carregam sob demanda) |
| Lighthouse (desempenho, acessibilidade, boas práticas) | ≥ 90 |
| Mascote | 60 FPS (mín. 30) em celular intermediário |
| Primeiro token do tutor | medir e registrar na F04 |

## Matriz de dispositivos e navegadores
| Ambiente | Prioridade |
|---|---|
| Chrome Android (celular do dono) | Alta |
| PWA instalado no Android | Alta |
| App Capacitor no Android (F10) | Alta |
| Chrome/Edge desktop (Windows) | Alta |
| Firefox desktop | Média |
| Safari iOS (PWA) | Média (iOS nativo só na F12) |
| Samsung Internet | Média |

## Revisões automáticas no portão
- `/code-review` no PR da fase.
- `/security-review` nas fases sensíveis (F02, F03, F07, F09, F10, F11) e sempre que tocar cofre, rede, auth, RLS ou funções.
