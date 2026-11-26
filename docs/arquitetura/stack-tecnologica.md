# Stack tecnológica

> **Versões:** não fixamos números aqui. Na F01, a IA verifica a versão estável atual de cada item (`npm view <pacote> version` e site oficial), registra na coluna "Versão adotada" e cita a fonte. Ver `../processo/controle-de-alucinacao-no-desenvolvimento.md`.

## Tabela principal
| Área | Escolha | Alternativas consideradas | Licença | Por quê | Versão adotada |
|---|---|---|---|---|---|
| Linguagem | TypeScript (modo `strict`) | JavaScript | Apache-2.0 | Tipos pegam erros antes de rodar; a IA erra menos com tipos | F01 |
| Build/dev server | Vite | webpack, Next.js | MIT | Simples, rápido, ótimo para PWA estática | F01 |
| UI | React | Svelte, Vue | MIT | Ecossistema enorme (inclusive 3D), muita documentação | F01 |
| Roteamento | React Router (modo SPA) | TanStack Router | MIT | Padrão de mercado, simples | F01 |
| Estilo | Tailwind CSS + variáveis CSS (tokens) | CSS Modules, CSS-in-JS | MIT | CSS estático (compatível com CSP sem `unsafe-inline`), produtivo em vibe coding | F01 |
| Componentes | shadcn/ui (copiados para o repo) sobre Radix | MUI, Chakra | MIT | Acessíveis, sem dependência pesada, código fica no repo | F01 |
| Estado do servidor | TanStack Query | SWR | MIT | Cache, novas tentativas, sincronização | F02 |
| Estado local | Zustand | Redux | MIT | Pequeno e simples | F01 |
| Validação | zod | yup, valibot | MIT | Valida dados da IA, formulários e API com o mesmo schema | F01 |
| Formulários | react-hook-form | Formik | MIT | Leve, integra com zod | F02 |
| i18n | i18next + react-i18next | Lingui | MIT | Maduro, suporta plural/gênero | F01 |
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
| PWA | vite-plugin-pwa (Workbox) | manual | MIT | Instalação e cache offline | F01 |
| Nativo | Capacitor (Android primeiro) | Expo/React Native | MIT | Mesmo código web. ADR-0001 | F10 |
| E-mail | Resend + React Email | Brevo, SES | — | Plano gratuito, API simples | F09 |
| Anti-robô | Cloudflare Turnstile (integrado ao Supabase Auth) | hCaptcha | — | Gratuito, invisível | F02 |
| Hospedagem | Cloudflare (Pages ou Workers com assets estáticos) | Netlify, GitHub Pages | — | Cabeçalhos customizados, gratuito. ADR-0004 | F01 |
| Testes unitários | Vitest + Testing Library | Jest | MIT | Integra com Vite | F01 |
| Testes E2E | Playwright (+ @axe-core/playwright) | Cypress | Apache-2.0 | Intercepta rede (prova que a chave não vaza) | F01 |
| Lint/format | ESLint (flat config) + typescript-eslint + Prettier | Biome | MIT | Regras de fronteira de módulos | F01 |
| Gerenciador de pacotes | pnpm | npm, yarn | MIT | Rápido, lockfile rígido, bloqueia scripts de instalação de dependências por padrão (confirmar na F01) | **12.23.0** (`npm view pnpm dist-tags` → `latest`, 2026-11-26); instalado com `npm i -g pnpm@12.23.0` |
| Runtime | Node.js LTS ativo | — | MIT | LTS ativo em 2026-11-26 (fonte: `https://nodejs.org/dist/index.json` → v26.13.1 "Lithium", de 2026-11-10; a linha 24 está em manutenção) | **26.13.1**, fixado em `.nvmrc`; gerenciado com nvm-windows 1.2.2 |
| CI | GitHub Actions | — | — | Gratuito para repositório público | F01 |

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
