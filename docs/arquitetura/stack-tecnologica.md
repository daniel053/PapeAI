# Stack tecnológica

> **Versões:** não fixamos números aqui. Na F01, a IA verifica a versão estável atual de cada item (`npm view <pacote> version` e site oficial), registra na coluna "Versão adotada" e cita a fonte. Ver `../processo/controle-de-alucinacao-no-desenvolvimento.md`.

## Tabela principal
| Área | Escolha | Alternativas consideradas | Licença | Por quê | Versão adotada |
|---|---|---|---|---|---|
| Linguagem | TypeScript (modo `strict`) | JavaScript | Apache-2.0 | Tipos pegam erros antes de rodar; a IA erra menos com tipos | **6.0.3** (a 7.0.2 é a `latest`, mas `typescript-eslint` 8.74.0 exige `typescript >=4.8.4 <6.1.0` — ver nota abaixo) |
| Build/dev server | Vite | webpack, Next.js | MIT | Simples, rápido, ótimo para PWA estática | **8.3.8** + `@vitejs/plugin-react` **6.3.0** (a 8.4.0 saiu em 2026-11-26 e foi barrada pela idade mínima do pnpm — ver nota) |
| UI | React | Svelte, Vue | MIT | Ecossistema enorme (inclusive 3D), muita documentação | **19.3.1** (`react`, `react-dom`) |
| Roteamento | React Router (modo SPA) | TanStack Router | MIT | Padrão de mercado, simples | **8.5.3** (pacote `react-router`; `createBrowserRouter` + `RouterProvider`) |
| Estilo | Tailwind CSS + variáveis CSS (tokens) | CSS Modules, CSS-in-JS | MIT | CSS estático (compatível com CSP sem `unsafe-inline`), produtivo em vibe coding | **4.3.5** (`tailwindcss` + `@tailwindcss/vite`; tokens via `@theme` em `app/src/ui/styles.css`) |
| Componentes | **Nativos (HTML + ARIA) em `app/src/ui/`** — ADR-0012 | shadcn/ui + Radix (descartado: injeta `<style>`, conflita com a CSP), MUI, Chakra, React Aria | — | Zero dependências, compatível com CSP sem `unsafe-inline` | Sem pacote (F01) |
| Estado do servidor | TanStack Query | SWR | MIT | Cache, novas tentativas, sincronização | F02 |
| Estado local | Zustand | Redux | MIT | Pequeno e simples | F01 |
| Validação | zod | yup, valibot | MIT | Valida dados da IA, formulários e API com o mesmo schema | F01 |
| Formulários | react-hook-form | Formik | MIT | Leve, integra com zod | F02 |
| i18n | i18next + react-i18next | Lingui | MIT | Maduro, suporta plural/gênero | **27.2.9** + **18.0.3** |
| Banco local | IndexedDB via Dexie.js | idb, localForage | Apache-2.0 | Consultas simples, migrações de versão | F03 |
| Criptografia | WebCrypto (nativa do navegador) | bibliotecas JS | — | Chaves não exportáveis; sem dependência | F03 |
| Backend | Supabase (Auth, Postgres, Edge Functions, pg_cron) | Firebase, Appwrite, PocketBase | Apache-2.0 (projeto) | SQL + RLS, plano gratuito, região São Paulo. ADR-0002 | F02 |
| Cliente Supabase | `@supabase/supabase-js` | — | MIT | Oficial | F02 |
| Migrações | Supabase CLI | Prisma, Drizzle | MIT | Oficial, gera SQL puro versionado | F02 |
| IA | `@anthropic-ai/sdk` (TypeScript) | fetch manual | MIT | Oficial; streaming, tipos, novas tentativas. ADR-0008 | F03 |
| Revisão espaçada | `ts-fsrs` | SM-2 próprio | MIT | Implementação do FSRS (verificar na F06) | F06 |
| 3D | three.js + @react-three/fiber + @react-three/drei | Babylon.js | MIT | Padrão da web; glTF de primeira classe | F08 |
| Fala (TTS) | Web Speech API → modelos locais (spike) → BYOK | — | — | ADR-0007; decisão final na F07 | F07 |
| Fala (ASR/pronúncia) | Spike: modelos locais via transformers.js/onnxruntime-web x BYOK | — | variável | Precisão medida antes de escolher | F07 |
| PWA | vite-plugin-pwa (Workbox) | manual | MIT | Instalação e cache offline | `vite-plugin-pwa` **2.0.0** (dev), `workbox-build` **7.4.1** (dev), `workbox-window` **7.4.1** (runtime) — verificados com `npm view` em 2026-11-26 (7,5 mi e 12,4 mi downloads/semana) |
| Nativo | Capacitor (Android primeiro) | Expo/React Native | MIT | Mesmo código web. ADR-0001 | F10 |
| E-mail | Resend + React Email | Brevo, SES | — | Plano gratuito, API simples | F09 |
| Anti-robô | Cloudflare Turnstile (integrado ao Supabase Auth) | hCaptcha | — | Gratuito, invisível | F02 |
| Hospedagem | Cloudflare **Workers com assets estáticos** (escolhido entre as duas opções da ADR-0004) | Cloudflare Pages, Netlify, GitHub Pages | — | Cloudflare recomenda Workers para projetos novos (docs lidas em 2026-11-26); `_headers` nativo; requisições de assets gratuitas | Wrangler **4.168.0**, só na CI (instalado pelo `cloudflare/wrangler-action` v4.1.3); `compatibility_date` 2026-11-24 |
| Testes unitários | Vitest + Testing Library | Jest | MIT | Integra com Vite | **Vitest 5.1.2** (Testing Library: entra quando houver teste de componente; `@testing-library/react` 16.3.3 verificado) |
| Testes E2E | Playwright (+ @axe-core/playwright) | Cypress | Apache-2.0 | Intercepta rede (prova que a chave não vaza) | `@playwright/test` **1.65.1** e `@axe-core/playwright` **4.14.1** (MPL-2.0) verificados em 2026-11-26; **instalação não aprovada pelo dono** na sessão 03 — testes de cabeçalhos feitos com Vitest |
| Lint/format | ESLint (flat config) + typescript-eslint + Prettier | Biome | MIT | Regras de fronteira de módulos | **ESLint 10.15.0**, `@eslint/js` 10.0.1, `typescript-eslint` 8.74.0, `eslint-plugin-react-hooks` 7.1.1, `globals` 17.14.0, **Prettier 3.10.1**; fronteiras de módulos por plugin local `tooling/eslint-plugin-papeai.js` |
| Gerenciador de pacotes | pnpm | npm, yarn | MIT | Rápido, lockfile rígido, bloqueia scripts de instalação de dependências por padrão (ainda não confirmado: nenhum pacote instalado na F01 pediu script) e recusa versões publicadas há menos de 24 h (`minimumReleaseAge`, observado em 2026-11-26) | **12.23.0** (`npm view pnpm dist-tags` → `latest`, 2026-11-26); instalado com `npm i -g pnpm@12.23.0` |
| Fontes | Nunito + Inter (self-hosted via Fontsource) | Google Fonts (CDN) | OFL-1.1 | Fontes servidas pelo próprio app (CSP e privacidade) | `@fontsource-variable/nunito` **5.3.0**, `@fontsource-variable/inter` **5.3.0** |
| Runtime | Node.js LTS ativo | — | MIT | LTS ativo em 2026-11-26 (fonte: `https://nodejs.org/dist/index.json` → v26.13.1 "Lithium", de 2026-11-10; a linha 24 está em manutenção) | **26.13.1**, fixado em `.nvmrc`; gerenciado com nvm-windows 1.2.2 |
| CI | GitHub Actions | — | — | Gratuito para repositório público | Workflows `ci.yml`, `codeql.yml`, `deploy.yml`; actions fixadas por SHA (lista em `../processo/git-github-e-ci.md`); gitleaks **8.30.1** por imagem com digest |

## Notas da verificação de versões (F01, 2026-11-26)
- **Fonte:** `npm view <pacote> name version license repository.url` e `npm view <pacote> peerDependencies` em 2026-11-26; downloads semanais em `api.npmjs.org/downloads/point/last-week/<pacote>` (todos entre 0,46 mi e 664 mi/semana). Versões fixadas **exatas** nos `package.json` (sem `^`).
- **TypeScript 6.0.3 em vez de 7.0.2:** o `typescript-eslint` declara `peerDependencies.typescript: ">=4.8.4 <6.1.0"`. Usar a 7 arriscaria desligar as regras de segurança do lint. **Tarefa:** migrar para a 7 quando o `typescript-eslint` aceitá-la (conferir `npm view typescript-eslint peerDependencies` a cada atualização).
- **Idade mínima de publicação (pnpm 12):** o pnpm recusa versões publicadas há menos de 24 h e, quando pedimos uma versão exata assim, grava uma exceção `minimumReleaseAgeExclude` no `pnpm-workspace.yaml`. Na F01 isso aconteceu com `vite@8.4.0` e `@types/node@26.6.11`; removemos as exceções e usamos `vite@8.3.8` e `@types/node@26.6.10`. **Regra:** não aceitar exceções de idade mínima sem justificativa registrada.
- **Dependências de desenvolvimento** (só no PC/CI, não vão para o navegador): `@types/react` 19.3.3, `@types/react-dom` 19.3.0, `@types/node` 26.6.10.

## O que **não** vamos usar (e por quê)
| Item | Motivo |
|---|---|
| Analytics de terceiros (Google Analytics etc.) | Privacidade e CSP limpa (PRIV-06). |
| CDNs de scripts/fontes (Google Fonts via link etc.) | Script/conexão de terceiros na origem do cofre; fontes ficam no próprio app (self-hosted). |
| CSS-in-JS em tempo de execução | Injeta `<style>` e exigiria `unsafe-inline` na CSP. |
| Proxy de IA no nosso servidor | Faria o servidor ver a chave (viola ADR-0003). |
| Serviços de feature flags externos | Configuração fica versionada no repositório (A-40). |
| Rastreamento de erros de terceiros no MVP | Risco de vazar dados; decidir na F11 com filtro de PII. |

## Política para novas dependências
Antes de instalar qualquer pacote, a IA preenche (no PR ou no doc da fase):
1. **Nome exato** e link oficial (npm + repositório).
2. **Existe mesmo?** `npm view <nome> name version repository license` — saída colada como evidência.
3. **Reputação:** downloads semanais, data do último release, mantenedores, issues de segurança abertas.
4. **Licença** compatível (MIT/Apache-2.0/BSD/ISC/GPL-3.0 são compatíveis com o código GPL do projeto — ADR-0005; evitar licenças incompatíveis com GPL-3.0, ex.: GPL-2.0-only).
5. **Necessidade:** por que não dá para fazer com o que já temos? Tamanho no bundle.
6. **Aprovação** do dono para dependências de runtime novas.

Pacotes com nome parecido com outro famoso, pouquíssimos downloads ou criados há poucos dias são **recusados** (risco de *slopsquatting* e *typosquatting*).
