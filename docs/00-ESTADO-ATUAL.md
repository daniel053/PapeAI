# 00 — Estado atual do projeto

> **Arquivo vivo.** A IA lê este arquivo primeiro em toda sessão e o atualiza no fim.
> É a fonte de verdade sobre "onde estamos" — nunca a memória da conversa.

**Última atualização:** 2026-11-26 — Sessão 02

## Onde estamos
- **Fase atual:** F00 — Fundação e decisões
- **Status da fase:** 🚧 Em andamento — decisões fechadas (perguntas respondidas, ADRs aceitas), ambiente instalado, arquivos do repositório criados. Faltam: MFA nas contas, chave de dev na Console, confirmar repositório público/privado, commit autorizado.
- **Próximo passo (dono):**
  1. Autorizar o commit das mudanças da sessão 02.
  2. Ativar MFA no GitHub, Google e Claude Console; criar organização e chave de dev com limite de gasto baixo (sem colar nada no chat).
  3. Fazer `gh auth login` e confirmar se o repositório é público ou privado.
- **Próximo passo (IA):** orientar o MFA, ativar recursos de segurança do GitHub (secret scanning, push protection, Dependabot) com autorização, registrar evidências e preparar o portão F00.

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
| 0001 | Web primeiro (PWA) + Capacitor para mobile | ✅ Aceita |
| 0002 | Supabase como backend (região São Paulo) | ✅ Aceita |
| 0003 | BYOK: chave somente no dispositivo, chamada direta ao provedor | ✅ Aceita |
| 0004 | Hospedagem Cloudflare e origens separadas (site x app) | ✅ Aceita |
| 0005 | Licença do código, do conteúdo e da marca | ✅ Aceita (GPL-3.0-or-later) |
| 0006 | Login com Google + e-mail e senha | ✅ Aceita (reescrita a pedido do dono) |
| 0007 | Voz local primeiro, provedores em nuvem opcionais via BYOK | Proposta (final após spike da F07) |
| 0008 | Modelos Claude e perfis de qualidade | Proposta (padrão decidido no portão F04) |
| 0009 | Conteúdo curado no repositório + geração por IA validada | ✅ Aceita |
| 0010 | Maioridade só nos Termos (sem perguntar idade) | ✅ Aceita com ajuste |
| 0011 | Dados sensíveis ficam no aparelho por padrão | ✅ Aceita |

## Perguntas que bloqueiam o portão F00
✅ Respondidas: Q-01 (PapeAI), Q-02 (macaco-sagui), Q-03 (Pro, sem créditos de API), Q-04 (créditos sob demanda), Q-06 (Google + e-mail e senha), Q-07 (sem perguntar idade), Q-08 (GPL-3.0-or-later), Q-12 (fica no OneDrive, sync desativado), Q-05 (stack web + Capacitor aprovada).

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
- Nenhum código escrito. Nenhuma conta criada. (Correção na sessão 02: a documentação já estava no commit `beda0a5 initial`.)
- Sessão 02: ambiente instalado — Git 2.56.0, Node 26.13.1 (LTS ativo, via nvm-windows; 24.14.0 e 11.15.0 mantidos), pnpm 12.23.0, GitHub CLI 2.106.0; `.nvmrc` criado; respostas Q-01/02/03 registradas. Mudanças da sessão 02 ainda não commitadas.

## Histórico de sessões
| # | Data | Fase | Resumo |
|---|---|---|---|
| 01 | 2026-11-26 | F00 | Documentação de planejamento criada a partir da ideia original; perguntas e ADRs propostas. |
| 02 | 2026-11-26 | F00 | Ambiente (Node 26, pnpm, gh) instalado; todas as perguntas bloqueantes respondidas; ADRs 0001–0006 e 0009–0011 aceitas (0007 e 0008 seguem propostas até F07/F04); LICENSE (GPL-3.0), .gitignore, .gitattributes, .editorconfig criados. |

## Notas para a próxima sessão da IA
- Não escrever código antes do portão F00.
- Começar pelas respostas às perguntas bloqueantes; cada resposta atualiza a ADR correspondente e os docs afetados (listados na própria ADR).
- Q-12: repositório fica no OneDrive (sincronização desativada pelo dono — risco aceito). Se a sincronização for reativada, mover antes de criar `.env.local` ou `node_modules`.
- Avisar o dono antes de precisar de créditos de API; erro de saldo insuficiente deve aparecer claro na tela (F03).
