# 00 — Estado atual do projeto

> **Arquivo vivo.** A IA lê este arquivo primeiro em toda sessão e o atualiza no fim.
> É a fonte de verdade sobre "onde estamos" — nunca a memória da conversa.

**Última atualização:** 2026-11-26 — Sessão 01

## Onde estamos
- **Fase atual:** F00 — Fundação e decisões
- **Status da fase:** 🚧 Em andamento — documentação de planejamento criada; aguardando revisão do dono.
- **Próximo passo (dono):**
  1. Ler `docs/01-VISAO-DO-PRODUTO.md` (5 min) e `docs/fases/README.md` (5 min).
  2. Responder as perguntas marcadas **[bloqueia F00]** em `docs/04-PERGUNTAS-EM-ABERTO.md` (pode responder no chat).
  3. Revisar as ADRs propostas em `docs/decisoes/` e dizer quais aceita.
- **Próximo passo (IA):** com as respostas, marcar ADRs como "Aceita", ajustar documentos afetados e conduzir os passos práticos da F00 (contas, MFA, ambiente, repositório).

## Portões de fase
| Fase | Nome | Status | Aprovada em | Tag git |
|---|---|---|---|---|
| F00 | Fundação e decisões | 🚧 em andamento | — | — |
| F01 | Esqueleto web, design system e segurança base | ⏳ não iniciada | — | — |
| F02 | Contas, usuários e dados no servidor | ⏳ não iniciada | — | — |
| F03 | Cofre da chave (BYOK) e conexão com o Claude | ⏳ não iniciada | — | — |
| F04 | Tutor em texto | ⏳ não iniciada | — | — |
| F05 | Onboarding, objetivos e nivelamento | ⏳ não iniciada | — | — |
| F06 | Trilha de aprendizado | ⏳ não iniciada | — | — |
| F07 | Voz: ouvir e falar | ⏳ não iniciada | — | — |
| F08 | Mascote 3D | ⏳ não iniciada | — | — |
| F09 | Engajamento: notificações e e-mails | ⏳ não iniciada | — | — |
| F10 | App Android e loja | ⏳ não iniciada | — | — |
| F11 | Endurecimento e lançamento | ⏳ não iniciada | — | — |
| F12 | Evolução: premium, idiomas, iOS | ⏳ não iniciada | — | — |

Legenda: ⏳ não iniciada · 🚧 em andamento · 🔎 em revisão (portão) · ✅ aprovada · ⚠️ aprovada com ressalvas · ❌ reprovada

## Decisões (ADRs)
| ADR | Título | Status |
|---|---|---|
| 0001 | Web primeiro (PWA) + Capacitor para mobile | Proposta |
| 0002 | Supabase como backend (região São Paulo) | Proposta |
| 0003 | BYOK: chave somente no dispositivo, chamada direta ao provedor | Proposta |
| 0004 | Hospedagem Cloudflare e origens separadas (site x app) | Proposta |
| 0005 | Licença do código, do conteúdo e da marca | Proposta (escolha do dono) |
| 0006 | Login com Google + e-mail com código (sem senha) | Proposta |
| 0007 | Voz local primeiro, provedores em nuvem opcionais via BYOK | Proposta (final após spike da F07) |
| 0008 | Modelos Claude e perfis de qualidade | Proposta (padrão decidido no portão F04) |
| 0009 | Conteúdo curado no repositório + geração por IA validada | Proposta |
| 0010 | Idade mínima de 18 anos | Proposta |
| 0011 | Dados sensíveis ficam no aparelho por padrão | Proposta |

## Perguntas que bloqueiam o portão F00
Q-01 (nome), Q-02 (mascote), Q-03 (seu plano Claude), Q-04 (orçamento mínimo), Q-05 (stack), Q-06 (login), Q-07 (idade), Q-08 (licença), Q-12 (repositório fora do OneDrive). Detalhes em `docs/04-PERGUNTAS-EM-ABERTO.md`.

## Bloqueios atuais
- Nenhum bloqueio técnico. Aguardando decisões do dono.

## Riscos ativos (top 5)
| # | Risco | Impacto | Mitigação | Onde |
|---|---|---|---|---|
| 1 | Público confunde assinatura do Claude com chave de API | Menos usuários conseguem usar | Explicação clara no onboarding; créditos de API de planos Max/Ultra/Team; multi-provedor no futuro | `01-VISAO-DO-PRODUTO.md`, ADR-0003 |
| 2 | XSS na versão web expõe a chave | Crítico | CSP estrita, zero scripts de terceiros, renderização segura, testes E2E de rede | `seguranca/cofre-da-chave-api.md` |
| 3 | Precisão de voz no aparelho abaixo do prometido | Alto (promessa central) | Spike com benchmark antes de prometer; BYOK de avaliação de pronúncia; comunicação honesta | `voz/`, F07 |
| 4 | Limites dos planos gratuitos (pausa do Supabase, 100 e-mails/dia no Resend) | Médio | Monitorar; escalonar envios; plano B documentado | `arquitetura/custos-e-limites.md` |
| 5 | Escopo grande para um dev solo | Alto | Fases pequenas, portões, backlog disciplinado, marcos M1–M4 | `fases/README.md` |

## Evidências da última sessão
- Sessão 01: criada a estrutura de documentação — **76 arquivos Markdown, ~6.000 linhas** (`CLAUDE.md`, `README.md`, `docs/` com processo, arquitetura, dados, segurança, IA, pedagogia, voz, design, 13 fases e 11 ADRs).
- Verificação automática: nenhum link Markdown quebrado; os únicos caminhos ainda inexistentes são arquivos previstos para fases futuras (`SECURITY.md`, prompts `*.v1.md`, `CONTRIBUTING.md` etc.).
- Fatos externos verificados na web em 2026-11-26 (fontes registradas nos docs): política de assinatura x chave de API da Anthropic, limites gratuitos de Supabase e Resend, regra dos 12 testadores da Google Play, verificação de desenvolvedor Android no Brasil.
- Nenhum código escrito. Nenhuma conta criada. **Nada commitado** (aguardando autorização).

## Histórico de sessões
| # | Data | Fase | Resumo |
|---|---|---|---|
| 01 | 2026-11-26 | F00 | Documentação de planejamento criada a partir da ideia original; perguntas e ADRs propostas. |

## Notas para a próxima sessão da IA
- Não escrever código antes do portão F00.
- Começar pelas respostas às perguntas bloqueantes; cada resposta atualiza a ADR correspondente e os docs afetados (listados na própria ADR).
- Se o dono quiser mover o repositório para fora do OneDrive (Q-12), fazer isso **antes** da F01.
