# 00 — Estado atual do projeto

> **Arquivo vivo.** A IA lê este arquivo primeiro em toda sessão e o atualiza no fim.
> É a fonte de verdade sobre "onde estamos" — nunca a memória da conversa.

**Última atualização:** 2026-11-26 — Sessão 03

## Onde estamos
- **Fase atual:** F01 — Esqueleto web, design system e segurança base
- **Status da fase:** 🚧 Em andamento — **tudo o que dá para fazer localmente está pronto** (sessão 03, commitado na branch `fase-01/esqueleto-web`, sem push). O portão depende de passos do dono: push/PR, Cloudflare, segredos, proteção da `main`, teste no celular.
- **Próximo passo (dono), nesta ordem:**
  1. Rodar o roteiro local abaixo.
  2. Autorizar o **push** da branch `fase-01/esqueleto-web` e a abertura do PR (a CI roda pela primeira vez lá).
  3. Seguir o checklist do dono em `processo/git-github-e-ci.md`: conta Cloudflare com MFA, token com permissão mínima, ambientes e segredos no GitHub, proteção da `main`, relato privado de vulnerabilidades.
  4. Decidir: Playwright + axe (recusado nesta sessão; o portão pede), ativar o hook gitleaks local (`pnpm hooks:install`), hook SEG-17 do Claude Code, prazo de 7 dias proposto no `SECURITY.md`, direção do logo (A/B/C).
- **Próximo passo (IA):** acompanhar a primeira execução da CI e corrigir o que falhar; após o deploy, `curl -I` das URLs reais, scanner de cabeçalhos, Lighthouse e o relatório do portão ("preparar portão").

### Roteiro rápido para o dono (sessão 03)
1. `pnpm install` (só na primeira vez) e depois `pnpm dev`.
2. Abrir `http://localhost:5173`, clicar em **English** e ver o texto mudar; recarregar e ver que continua em inglês; voltar para **Português**.
3. Tocar em **Configurações** (no celular, na barra de baixo) e trocar o tema entre Claro, Escuro e Igual ao aparelho.
4. Abrir `http://localhost:5173/dev/componentes` (galeria, só em desenvolvimento) e testar diálogo, aviso, abas e alternador com mouse e teclado (Tab, setas, Esc).
5. Em outro terminal: `pnpm test` (241 testes), `pnpm lint`, `pnpm typecheck`.
6. Versão de produção com os cabeçalhos de segurança: `pnpm build` e `pnpm preview:app`, abrir `http://localhost:4173` e, no PowerShell, `curl.exe -I http://localhost:4173/` para ver a CSP.

### Pendências herdadas da F00 (aprovada pelo dono sem estas evidências)
- [ ] Confirmar MFA ativo no GitHub e no Google (não verificado na sessão 02).
- [ ] Claude Console: workspace `papeai-dev` com limite de gasto baixo (necessário antes da F03).
- [ ] Decidir sobre `docs/03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md`, já público desde o commit `initial` (manter, editar daqui para frente ou reescrever histórico).
- [ ] Autorizar push dos commits locais e tag `F00-aprovada`.
- Já feito na F00: `gh auth login` (daniel053); repositório **público**; secret scanning, push protection, Dependabot alerts e relato privado de vulnerabilidades ativos (verificado via API em 2026-11-26). Proteção da branch `main` fica para a F01 (CI).

## Portões de fase
| Fase | Nome | Status | Aprovada em | Tag git |
|---|---|---|---|---|
| F00 | Fundação e decisões | ✅ aprovada (pendências herdadas acima) | 2026-11-26 | — (aguarda autorização) |
| F01 | Esqueleto web, design system e segurança base | 🚧 em andamento (parte local pronta; faltam passos do dono) | — | — |
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
| 0012 | Componentes de interface nativos, sem shadcn/Radix | ✅ Aceita (F01) |

## Perguntas que bloqueiam o portão F00
✅ Respondidas: Q-01 (PapeAI), Q-02 (macaco-sagui), Q-03 (Pro, sem créditos de API), Q-04 (créditos sob demanda), Q-06 (Google + e-mail e senha), Q-07 (sem perguntar idade), Q-08 (GPL-3.0-or-later), Q-12 (fica no OneDrive, sync desativado), Q-05 (stack web + Capacitor aprovada).

## Bloqueios atuais
- Push, deploy, proteção da `main` e conta Cloudflare dependem do dono (checklist em `processo/git-github-e-ci.md`).
- Playwright + axe recusados por ora: o critério do portão "e2e (smoke)" e o axe ficam em aberto até nova decisão.

## Riscos ativos (top 5)
| # | Risco | Impacto | Mitigação | Onde |
|---|---|---|---|---|
| 1 | Público confunde assinatura do Claude com chave de API | Menos usuários conseguem usar | Explicação clara no onboarding; créditos de API de planos Max/Ultra/Team; multi-provedor no futuro | `01-VISAO-DO-PRODUTO.md`, ADR-0003 |
| 2 | XSS na versão web expõe a chave | Crítico | CSP estrita, zero scripts de terceiros, renderização segura, testes E2E de rede | `seguranca/cofre-da-chave-api.md` |
| 3 | Precisão de voz no aparelho abaixo do prometido | Alto (promessa central) | Spike com benchmark antes de prometer; BYOK de avaliação de pronúncia; comunicação honesta | `voz/`, F07 |
| 4 | Limites dos planos gratuitos (pausa do Supabase, 100 e-mails/dia no Resend) | Médio | Monitorar; escalonar envios; plano B documentado | `arquitetura/custos-e-limites.md` |
| 5 | Escopo grande para um dev solo | Alto | Fases pequenas, portões, backlog disciplinado, marcos M1–M4 | `fases/README.md` |

## Evidências da última sessão
- **Sessão 03 (F01) — segunda parte, com 4 agentes em paralelo** (PWA, cabeçalhos de segurança, CI/deploy, design system), cada um com arquivos próprios:
  - Verificação final do conjunto (raiz): `pnpm lint` ✅ · `pnpm format:check` ✅ · `pnpm typecheck` ✅ · `pnpm test` ✅ **241 testes em 10 arquivos** · `pnpm build` ✅ (app: JS 396,2 KB / **125,7 KB gzip**; precache do service worker: 14 arquivos, 652,9 KiB) · `pnpm audit --prod` ✅ "No known vulnerabilities found" · `node tooling/generate-icons.js --check` ✅.
  - Dono aprovou: `vite-plugin-pwa` 2.0.0, `workbox-build`/`workbox-window` 7.4.1. Recusou por ora: Playwright + axe. Decidiu: componentes nativos sem pacote (**ADR-0012**).
  - **PWA:** manifest, ícones 192/512/maskable/apple-touch gerados sem dependência a partir do SVG do sagui, service worker só com estáticos, aviso "nova versão". Fluxo testado em Edge headless com a CSP real: registro, cache, atualização, offline.
  - **Segurança:** `_headers` do app e do site (CSP sem `unsafe-inline`, `connect-src 'self'`, `frame-ancestors 'none'`, HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP, `X-Robots-Tag` no app); Trusted Types em modo só-relatório (o registro do service worker o violaria se aplicado). `robots.txt`, meta `noindex`, `security.txt` (RFC 9116, contato pelo GitHub, expira 2027-11-25) e `SECURITY.md`. 49 testes em `app/src/security-headers.test.ts`. Servidor local `tooling/serve-static.js` aplica o `_headers`.
  - Navegador (build de produção servido com os cabeçalhos): renderiza sem violação da CSP aplicada; tentativas de script embutido, `fetch` externo e imagem externa foram **bloqueadas**; única origem acessada: a do app. O painel do navegador do Claude não registra service worker (limitação do ambiente) — instalação a verificar no celular.
  - **Design system:** Button, TextField, Card, Dialog (`<dialog>` nativo), Toast, Switch, Tabs, RadioGroup; navegação inferior no celular; tela Configurações (idioma + tema); tema escuro; tons `-700` com contraste ≥ 4,5:1 — 25 pares por tema verificados por `ui/tokens/tokens.test.ts`.
  - **CI/deploy (arquivos, ainda não executados no GitHub):** `ci.yml` (lint, format, typecheck, unit, build, audit, secrets/gitleaks), `codeql.yml`, `deploy.yml` (Cloudflare Workers com assets estáticos; pula sem erro enquanto não há segredos), `dependabot.yml` com `cooldown`, `.gitleaks.toml`, hook de pré-commit (não ativado), template de PR. Actions fixadas por SHA resolvido via `gh api`.
  - Correção do coordenador: aviso do Vite sobre import sem extensão em `vite.config.ts` resolvido (`allowImportingTsExtensions` em `tsconfig.node.json`).
- **Sessão 03 (F01) — primeira parte:**
  - Versões verificadas com `npm view` e registradas com fonte em `arquitetura/stack-tecnologica.md` (lista aprovada pelo dono antes da instalação).
  - TypeScript fixado em 6.0.3 (a 7.0.2 é incompatível com o `typescript-eslint` 8.74.0: `peerDependencies.typescript ">=4.8.4 <6.1.0"`).
  - pnpm 12 recusou `vite@8.4.0` e `@types/node@26.6.11` (publicados há menos de 24 h) e gravou exceções sozinho; exceções removidas, usadas `vite@8.3.8` e `@types/node@26.6.10`; lockfile refeito do zero.
  - `pnpm lint` ✅ · `pnpm format:check` ✅ · `pnpm typecheck` ✅ · `pnpm test` ✅ **73 testes** (3 arquivos: `core/net/guard.test.ts`, `security-lint.test.ts`, `core/i18n/i18n.test.ts`) · `pnpm build` ✅ (app: JS 376,6 KB / **119,3 KB gzip**; site: 1,3 KB HTML + 0,9 KB CSS, sem JS).
  - O teste de lint encontrou uma brecha real: `no-restricted-imports` não pegava `'../vault'` vindo de `core/tutor`. Trocado por regra local que resolve o caminho (`tooling/eslint-plugin-papeai.js`).
  - Chave de tradução inexistente gera erro de compilação (verificado com arquivo temporário: TS2345).
  - Navegador (painel do Claude, `pnpm dev`): troca pt-BR ↔ en atualiza textos e `<html lang>`, escolha persiste após recarregar, rota inexistente mostra 404 traduzida, console sem erros, **única origem acessada: `http://localhost:5173`**; layout conferido em 375×812 (celular).
  - `app/dist/index.html` sem `<script>` ou `style` embutidos (pronto para CSP sem `unsafe-inline`).
  - Contraste da paleta medido: success/warning/error abaixo de 4,5:1 em texto normal — pendência registrada em `design/identidade-visual-e-marca.md`.
- Sessão 01: criada a estrutura de documentação — **76 arquivos Markdown, ~6.000 linhas** (`CLAUDE.md`, `README.md`, `docs/` com processo, arquitetura, dados, segurança, IA, pedagogia, voz, design, 13 fases e 11 ADRs).
- Verificação automática: nenhum link Markdown quebrado; os únicos caminhos ainda inexistentes são arquivos previstos para fases futuras (`SECURITY.md`, prompts `*.v1.md`, `CONTRIBUTING.md` etc.).
- Fatos externos verificados na web em 2026-11-26 (fontes registradas nos docs): política de assinatura x chave de API da Anthropic, limites gratuitos de Supabase e Resend, regra dos 12 testadores da Google Play, verificação de desenvolvedor Android no Brasil.
- Nenhum código escrito. Nenhuma conta criada. (Correção na sessão 02: a documentação já estava no commit `beda0a5 initial`.)
- Sessão 02: ambiente instalado — Git 2.56.0, Node 26.13.1 (LTS ativo, via nvm-windows; 24.14.0 e 11.15.0 mantidos), pnpm 12.23.0, GitHub CLI 2.106.0; `.nvmrc` criado; respostas Q-01/02/03 registradas. Mudanças da sessão 02 ainda não commitadas.

## Histórico de sessões
| # | Data | Fase | Resumo |
|---|---|---|---|
| 01 | 2026-11-26 | F00 | Documentação de planejamento criada a partir da ideia original; perguntas e ADRs propostas. |
| 03 | 2026-11-26 | F01 | Esqueleto local (workspace pnpm, React 19 + Vite 8 + TS 6, Tailwind 4, i18n, `core/net`, lint de segurança) + 4 agentes: PWA, cabeçalhos/CSP/robots/security.txt, CI/Dependabot/CodeQL/deploy Cloudflare (arquivos), design system nativo com tema escuro (ADR-0012). 241 testes verdes. Commit na branch `fase-01/esqueleto-web`, sem push. |
| 02 | 2026-11-26 | F00 | Ambiente (Node 26, pnpm, gh) instalado; todas as perguntas bloqueantes respondidas; ADRs 0001–0006 e 0009–0011 aceitas (0007 e 0008 seguem propostas até F07/F04); LICENSE (GPL-3.0), .gitignore, .gitattributes, .editorconfig criados. |

## Notas para a próxima sessão da IA
- Antes de qualquer `pnpm add`: `npm view`, licença, downloads e aprovação do dono para dependências de runtime. Não aceitar `minimumReleaseAgeExclude` sem justificativa.
- Migrar para TypeScript 7 quando o `typescript-eslint` aceitar (`npm view typescript-eslint peerDependencies`).
- Fontes: o service worker já ignora os subconjuntos cirílico/grego/vietnamita no precache (`globIgnores`).
- Primeira execução da CI pode revelar problemas não verificáveis localmente (ex.: gitleaks em Docker com repositório montado; wrangler-action em pasta só com artefato). Corrigir no PR.
- Na hora do commit da sessão 03: `tooling/git-hooks/pre-commit` precisa do bit de execução (`git add --chmod=+x`).
- Trusted Types: aplicar de verdade exige uma política nomeada para o registro do service worker (`workbox-window` aceita `TrustedScriptURL`) — tarefa + ADR.
- O sagui 2D tem cores fixas e a cabeça marrom tem pouco contraste no tema escuro (F08).
- Q-12: repositório fica no OneDrive (sincronização desativada pelo dono — risco aceito). Se a sincronização for reativada, mover antes de criar `.env.local` ou `node_modules`.
- Avisar o dono antes de precisar de créditos de API; erro de saldo insuficiente deve aparecer claro na tela (F03).
