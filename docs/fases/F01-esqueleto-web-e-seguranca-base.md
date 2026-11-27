# F01 — Esqueleto web, design system e segurança base

> **Status:** 🚧 Em andamento (aberta em 2026-11-26) — tudo o que dá para fazer localmente está pronto (sessão 03); faltam as etapas que dependem do dono (Cloudflare, segredos, proteção da `main`, aprovação do Playwright, logo).

## Objetivo
Um app **vazio, mas real**, no ar: PWA em React + Vite + TypeScript, design system inicial, i18n, CSP e cabeçalhos de segurança, `robots.txt`/`noindex`, `security.txt`, CI completa e deploy automático em **duas origens** (site institucional provisório e app). Você abre no celular e instala como app.

## Documentos desta fase
1. `../arquitetura/visao-geral.md`, `../arquitetura/stack-tecnologica.md`, `../arquitetura/estrutura-de-pastas-e-modulos.md`
2. `../seguranca/seguranca-web-headers-csp-robots.md`
3. `../design/identidade-visual-e-marca.md`, `../design/ux-telas-e-acessibilidade.md`
4. `../processo/git-github-e-ci.md`, `../processo/testes-e-qualidade.md`
5. `../processo/controle-de-alucinacao-no-desenvolvimento.md` (antes de instalar qualquer pacote)
6. `../seguranca/checklist-de-seguranca-por-fase.md` (F01)

## Pré-requisitos
- F00 aprovada (ADR-0001, 0004 e 0005 aceitas; ambiente pronto).

## Escopo
**Inclui:** monorepo pnpm (`app/`, `site/`), TypeScript estrito, ESLint/Prettier com regras de fronteira e proibições de segurança, tokens de design e componentes base, layout mobile-first, i18n pt-BR/en, PWA (manifest, ícones, service worker só de estáticos), CSP/cabeçalhos, `robots.txt`, `security.txt`, `SECURITY.md`, esqueleto da guarda de rede (`core/net`), Vitest + Playwright + axe, GitHub Actions, Dependabot, CodeQL, gitleaks, deploy na Cloudflare (preview por PR + produção), placeholder 2D do mascote.
**Não inclui:** login, banco, IA, voz, 3D.

## Passos
### A. Estrutura e qualidade de código
- [x] Verificar versões atuais (`npm view ... version`) de Vite, React, TypeScript, Tailwind, React Router, i18next, Vitest, Playwright e registrar em `../arquitetura/stack-tecnologica.md`. *(sessão 03; TypeScript 6.0.3 por compatibilidade com o lint)*
- [ ] Criar workspace pnpm com `app/` e `site/`; scripts `dev`, `build`, `test`, `lint`, `typecheck`, `e2e`. *(feito, exceto `e2e`, que chega com o Playwright)*
- [x] TypeScript `strict`; ESLint (flat config) com: fronteiras de módulos, proibição de `dangerouslySetInnerHTML`/`eval`/`innerHTML`, imports restritos de `core/vault` (pasta ainda vazia, regra já ativa). *(+ `fetch` direto proibido fora de `core/net`)*
- [x] Estrutura de pastas conforme `../arquitetura/estrutura-de-pastas-e-modulos.md`. *(pastas criadas conforme o uso; as demais surgem em suas fases)*

### B. Design system
- [x] Tokens (cores, tipografia, espaçamento, raios) como variáveis CSS + Tailwind. *(tema escuro com preferência sistema/claro/escuro; tons `-700` para texto de status)*
- [x] Fontes self-hosted (Nunito/Inter, licença OFL registrada).
- [x] Componentes base acessíveis: botão, campo, cartão, diálogo, aviso (toast), alternador, abas. *(nativos, sem pacote — ADR-0012; + grupo de rádio; galeria em `/dev/componentes` só em desenvolvimento)*
- [x] Casca do app: barra superior, navegação inferior (mobile), área do mascote (placeholder 2D). *(+ tela Configurações: idioma e tema)*
- [ ] Logo: direção escolhida pelo dono (ou placeholder textual). *(placeholder textual em uso; direção A/B/C aguarda o dono)*

### C. Internacionalização
- [x] i18next com `pt-BR` e `en`; regra: nenhum texto de interface fixo no código. *(chave inexistente vira erro de compilação; teste garante as mesmas chaves nos dois idiomas)*

### D. PWA
- [x] Manifest, ícones (incluindo adaptável), service worker com cache **só de estáticos**, aviso de nova versão. *(ícones gerados sem dependência por `tooling/generate-icons.js`; instalação no celular depende do deploy)*

### E. Segurança base
- [x] `app/public/_headers` com a CSP do app (`connect-src 'self'` por enquanto) e demais cabeçalhos; `site/public/_headers`. *(Trusted Types em modo só-relatório; verificação em produção pendente)*
- [x] `robots.txt` (app: `Disallow: /`; site: `Allow: /`), meta `noindex` no app, `X-Robots-Tag`.
- [x] `/.well-known/security.txt` nas duas origens; `SECURITY.md` (promessas + como reportar). *(`Canonical` quando houver domínio)*
- [x] `core/net`: guarda de rede com allowlist (inicialmente só a própria origem) + testes.
- [x] Hook local de pré-commit com gitleaks; job de gitleaks na CI. *(hook pronto; ativar com `pnpm hooks:install` após instalar o gitleaks — decisão do dono)*
- [x] Avaliar hook do Claude Code que bloqueia gravação de padrões de chave (SEG-17) — configurar só com aprovação. *(proposta em `../processo/git-github-e-ci.md`; não configurado)*

### F. CI/CD e hospedagem
- [ ] GitHub Actions: lint, typecheck, unit, build, e2e (smoke), gitleaks, auditoria de dependências; permissões mínimas; actions fixadas por SHA. *(arquivos prontos, exceto e2e — Playwright não aprovado; ainda não rodou no GitHub)*
- [x] Dependabot (npm + actions), CodeQL (se o repositório for público). *(arquivos prontos; passam a valer no primeiro push)*
- [ ] Proteção da `main`: PR obrigatório + CI verde. *(dono — passo a passo em `../processo/git-github-e-ci.md`)*
- [ ] Cloudflare: conta com MFA; dois projetos (site e app); preview por PR; produção na `main`; subdomínios gratuitos até existir domínio. *(Workers com assets estáticos; `wrangler.jsonc` e `deploy.yml` prontos; falta a conta e os segredos — dono)*

### G. Testes
- [x] Vitest funcionando com 1 teste real (ex.: guarda de rede). *(241 testes em 10 arquivos)*
- [ ] Playwright: app carrega; cabeçalhos presentes; `robots.txt` correto; axe sem violações graves na tela inicial. *(instalação não aprovada na sessão 03; cabeçalhos, robots e security.txt já cobertos por Vitest em `app/src/security-headers.test.ts`)*

## Segurança nesta fase
Seção F01 do checklist. Destaques: CSP sem `unsafe-inline`/`unsafe-eval`; zero terceiros no app; origens separadas; segredos fora do repositório.

## Testes e verificações
- Saída de `curl -I` das duas URLs de produção no relatório.
- Resultado de scanner público de cabeçalhos.
- Lighthouse (meta inicial ≥ 90 em desempenho, acessibilidade e boas práticas) — registrar números.
- CI verde no PR da fase.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Biblioteca que exige `unsafe-inline` | Escolher alternativas; nunca afrouxar a CSP sem ADR |
| Trusted Types quebrando bibliotecas | Ativar só depois de testar; registrar decisão |
| Versões/comandos inventados | Verificar na documentação oficial antes; colar evidência |
| Cache do service worker servindo versão velha | Estratégia de atualização com aviso |

## O que você vai aprender
- O que são componentes React e como o Vite monta o app.
- O que a CSP faz e como ler um cabeçalho HTTP.
- Como a CI roda testes a cada mudança e como funciona um deploy de preview.

## Portão de aprovação F01
**Critérios:**
- [ ] Site e app no ar em origens separadas; app instalável como PWA.
- [ ] CSP e cabeçalhos conforme o documento, verificados em produção.
- [ ] `robots.txt`, `noindex`, `security.txt`, `SECURITY.md` publicados.
- [ ] CI verde com todos os jobs; proteção da `main` ativa.
- [ ] Design system base e i18n funcionando (trocar idioma da interface).
- [ ] Versões registradas em `../arquitetura/stack-tecnologica.md`.

**Roteiro de teste do dono (15 min):**
1. Abra a URL do app no celular e instale ("Adicionar à tela inicial").
2. Troque o idioma da interface para inglês e volte.
3. Acesse `<url-do-app>/robots.txt` e veja `Disallow: /`.
4. Abra um PR de teste (a IA ajuda) e veja a CI rodar e o link de preview aparecer.
5. Diga **"aprovado F01"** ou o que precisa mudar.
