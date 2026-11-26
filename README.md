# PapeAI

> Escola de idiomas com IA, **gratuita e de código aberto**. Você traz a sua chave de API — e ela fica **só no seu aparelho**.

**Status:** 📐 Planejamento — Fase **F00 (Fundação e decisões)**. Ainda não há código.
Estado detalhado: [`docs/00-ESTADO-ATUAL.md`](docs/00-ESTADO-ATUAL.md).

---

## A ideia em 30 segundos
- 🐾 **Tutor-mascote 3D** (low poly, bordas suaves, leve) que conversa com você.
- 💬 **Nivelamento que não é prova:** um bate-papo, só no idioma que você quer aprender, descobre seu nível.
- 🎯 **Trilha guiada pelo seu objetivo:** trabalhar como dev, viajar para a Austrália, mudar de país, entender séries... *Vá pronto para o que você quer fazer.*
- 🧑‍🏫 **Professor do seu jeito:** gentil, equilibrado ou **sem filtro** (só se você pedir — e dá para desligar a qualquer momento).
- 🎙️ **Escuta precisa:** mostramos exatamente o que entendemos da sua fala, palavra por palavra, sem "arredondar", com ritmo, pausas e entonação.
- 🆓 **Grátis de verdade:** sem assinatura do app. Você usa a sua chave de API e paga só o que consumir, direto ao provedor — e vê o custo de cada lição.
- 🌍 **Inglês primeiro**, com a arquitetura aberta para outros idiomas.

## Compromissos de segurança (e como verificar)
1. **Sua chave de API nunca vai para os nossos servidores.** Ela é guardada cifrada no seu aparelho e enviada somente para o provedor dela (ex.: `api.anthropic.com`).
2. **O navegador impõe isso:** a política de segurança de conteúdo (CSP) do app só permite conexões com uma lista fixa de domínios.
3. **O código prova isso:** um único módulo (`app/src/core/vault/`) toca a chave, e testes automatizados verificam que ela não aparece em nenhuma outra requisição.
4. **Dados mínimos no servidor:** guardamos seu progresso de estudo. Conversas, áudios e uso de tokens ficam no seu aparelho.
5. **Cada usuário só enxerga os próprios dados** (Row Level Security no banco), e páginas internas não são indexadas por buscadores.

Detalhes: [`docs/seguranca/`](docs/seguranca/).

## ⚠️ Assinatura do Claude não é chave de API
A assinatura do Claude (Pro/Max — a que inclui o Claude Code) **não pode ser usada como login em apps de terceiros**; o caminho oficial é uma **chave de API** criada na Claude Console (cobrança separada, pré-paga). Alguns planos (Max, Ultra e Team, nas regras atuais) incluem **créditos mensais de API** que podem ser resgatados. Explicação completa e fontes: [`docs/01-VISAO-DO-PRODUTO.md`](docs/01-VISAO-DO-PRODUTO.md#assinatura-do-claude-x-chave-de-api).

## Como o repositório está organizado
| Caminho | O que tem |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Roteador para a IA (lido automaticamente pelo Claude Code). |
| [`docs/00-ESTADO-ATUAL.md`](docs/00-ESTADO-ATUAL.md) | Onde estamos, próximo passo, portões aprovados. |
| [`docs/README.md`](docs/README.md) | Índice de toda a documentação. |
| [`docs/fases/`](docs/fases/) | As 13 fases de desenvolvimento (F00 a F12), cada uma com portão de aprovação. |
| [`docs/decisoes/`](docs/decisoes/) | Decisões de arquitetura (ADRs). |
| [`docs/04-PERGUNTAS-EM-ABERTO.md`](docs/04-PERGUNTAS-EM-ABERTO.md) | O que o dono do projeto precisa decidir. |

## Como trabalhamos (vibe coding guiado por fases)
1. O dono abre o Claude Code e diz **"continuar"**.
2. A IA lê o estado atual, abre só o documento da fase e propõe um plano curto.
3. A IA implementa em passos pequenos, sempre com verificação (testes, build, demo).
4. No fim da fase, a IA prepara o **relatório do portão** e um roteiro de teste manual.
5. O dono testa e responde **"aprovado F0X"** (ou pede correções). Só então a próxima fase começa.

Processo completo: [`docs/processo/fluxo-de-trabalho-vibe-coding.md`](docs/processo/fluxo-de-trabalho-vibe-coding.md).

## Roadmap
| Fase | Nome | Marco |
|---|---|---|
| F00 | Fundação e decisões | — |
| F01 | Esqueleto web, design system e segurança base | — |
| F02 | Contas, usuários e dados no servidor | — |
| F03 | Cofre da chave (BYOK) e conexão com o Claude | — |
| F04 | Tutor em texto: personalidade, correções e memória | **M1 — "Eu uso"** |
| F05 | Onboarding, objetivos e nivelamento | — |
| F06 | Trilha de aprendizado, revisão espaçada e progresso | — |
| F07 | Voz: ouvir e falar com precisão | — |
| F08 | Mascote 3D | — |
| F09 | Engajamento: rotina, notificações e e-mails | **M2 — Beta web fechado** |
| F10 | App Android e loja | **M3 — Android** |
| F11 | Endurecimento, conformidade e lançamento | **M4 — Lançamento público** |
| F12 | Evolução: premium, novos idiomas e iOS | M5 — Evolução contínua |

## Licença
| O quê | Licença |
|---|---|
| Código | [GPL-3.0-or-later](LICENSE) |
| Conteúdo pedagógico (`content/`) | CC BY-SA 4.0 |
| Documentação (`docs/`) | CC BY 4.0 |
| Nome "PapeAI", logo e mascote | Todos os direitos reservados |

**Aviso de marca:** o código é livre, mas o nome "PapeAI", o logo e o mascote (macaco-sagui) não são. Forks devem usar nome e identidade visual próprios. Detalhes em [ADR-0005](docs/decisoes/ADR-0005-licenca-codigo-conteudo-e-marca.md).
