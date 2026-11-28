# Relatório do portão — F01 Esqueleto web, design system e segurança base
**Data:** 2026-11-28 · **Commit/PR:** [`82d5394`](https://github.com/daniel053/PapeAI/commit/82d5394) / [PR #1](https://github.com/daniel053/PapeAI/pull/1) · **Ambiente testado:** dev + produção (Cloudflare `workers.dev`); celular pendente

## Resumo
App (PWA) e site institucional estão publicados em origens separadas, com CSP estrita e os demais cabeçalhos de segurança, conferidos em produção. A CI completa (9 checks obrigatórios + CodeQL) está verde e a `main` está protegida. Faltam a instalação no celular (teste do dono), o scanner público de cabeçalhos e o `/security-review`.

**URLs de produção**
- App: https://papeai-app.danielmessias053.workers.dev
- Site: https://papeai-site.danielmessias053.workers.dev

## Critérios do portão
| Critério | Status | Evidência |
|---|---|---|
| Site e app no ar em origens separadas | ✅ | Deploy `deploy-production (app)` e `(site)` com sucesso (run 46104564118, 2026-11-28). Duas origens `workers.dev` distintas. |
| App instalável como PWA | ⚠️ | `manifest.webmanifest` e `sw.js` respondem 200 em produção, e o fluxo do service worker foi testado em navegador headless na sessão 03. **Falta instalar no celular** (passo 1 do roteiro). |
| CSP e cabeçalhos conforme o documento, verificados em produção | ✅ | `curl -I` em `/`, `/configuracoes`, `/rota-inexistente`, `/sw.js` e `/manifest.webmanifest` do app: CSP `default-src 'none'; script-src 'self' …`, HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP e `x-robots-tag: noindex, nofollow, noarchive` em todas. No site: CSP com `script-src 'none'`, sem `X-Robots-Tag` (indexável), e 404 real também com CSP. |
| `robots.txt`, `noindex`, `security.txt`, `SECURITY.md` publicados | ✅ | `robots.txt` do app = `User-agent: *` / `Disallow: /`. `/.well-known/security.txt` responde 200 no app e no site. `SECURITY.md` está na `main`. |
| CI verde com todos os jobs; proteção da `main` ativa | ✅ | PR #1: `lint`, `format`, `typecheck`, `unit`, `build`, `audit`, `secrets`, `analyze (javascript-typescript)`, `analyze (actions)` e `CodeQL` verdes. Ruleset `main-protection` (id 28272315) ativo: PR obrigatório, os 9 checks obrigatórios com branch atualizada, sem force push e sem exclusão. Conferido em `gh api repos/daniel053/PapeAI/rules/branches/main`. |
| Design system base e i18n funcionando | ✅ | Navegador do Claude, em produção: `/configuracoes` abre direto, com troca de idioma e tema. Todas as requisições vão só para a origem do app. Console: só o aviso esperado do Trusted Types em modo só-relatório. |
| Versões registradas em `stack-tecnologica.md` | ✅ | Registradas na sessão 03, com `npm view` e fonte. |

## Checklist de segurança da fase (F01)
- [x] CSP do app conforme `seguranca-web-headers-csp-robots.md`, testada em produção (`curl -I`).
- [ ] Cabeçalhos de segurança com nota máxima em scanner público (ou justificativa). **Pendente:** o scan envia a URL a um serviço externo, então precisa da autorização do dono.
- [x] `robots.txt` (app: `Disallow: /`), `X-Robots-Tag` e meta `noindex` no app.
- [x] `security.txt` publicado; `SECURITY.md` no repositório.
- [x] Origens separadas: site x app.
- [x] Zero scripts/fontes de terceiros no app (rede do navegador em produção: só a própria origem).
- [x] Regras de lint: proibição de `dangerouslySetInnerHTML`/`eval`; fronteiras de módulos (cobertas por testes).
- [x] Branch `main` protegida; Actions com permissões mínimas e fixadas por SHA.
- [ ] Hook local anti-segredo (gitleaks) instalado; hook SEG-17 avaliado. **Pendente:** decisão do dono (`pnpm hooks:install`; proposta SEG-17 em `processo/git-github-e-ci.md`).

Resumo do `/security-review`: **não rodado ainda.** O CodeQL encontrou 2 alertas no PR #1 (regex de `<script>` sensível a maiúsculas em teste; remoção incompleta de comentários no gerador de ícones). Os dois foram corrigidos em `ff00bfb`.

## Testes
- Unitários: 241 passaram / 0 falharam (CI do PR #1 e local).
- E2E: não existe. Playwright + axe recusados por ora pelo dono.
- Evals: não se aplica.

## Pendências conhecidas
| Pendência | Impacto | Proposta |
|---|---|---|
| Instalar o PWA no celular | Critério do portão sem evidência de aparelho | Passo 1 do roteiro abaixo |
| Scanner público de cabeçalhos | Item do checklist de segurança | Dono autoriza o scan, ou aceita os `curl -I` acima como evidência |
| `/security-review` | Item do checklist de PR (headers, CI) | Rodar antes do "aprovado F01" |
| Preview por PR ignora `not_found_handling` (rotas internas dão 404 sem CSP no preview) | Só nos links de preview; a produção funciona | Registrado em `processo/git-github-e-ci.md`. Testar rotas internas só em produção ou pela tela inicial |
| E2E (Playwright + axe) | Critério "e2e smoke" e axe em aberto | Nova decisão do dono |
| Subdomínio `danielmessias053` nas URLs públicas | Expõe parte do e-mail do dono | Dono decide se troca no painel da Cloudflare |
| Pendências herdadas da F00 (MFA, workspace do Claude Console, doc 03, tag) | Ver `00-ESTADO-ATUAL.md` | Seguem abertas |
| Regras de merge (só squash, apagar branch) e Dependabot security updates | Higiene do repositório | Dono optou por não aplicar agora |

## Riscos novos ou alterados
- O squash do PR #1 juntou o commit da F00 (`4a3ee7a`) ao commit da F01 na `main`. O histórico fica menos granular, mas o conteúdo está completo.
- Os links de preview são públicos, como a produção. Aceitável enquanto o app não tiver segredo de servidor.

## Decisões tomadas nesta fase
- ADR-0012: componentes de interface nativos, sem shadcn/Radix.
- Cloudflare Workers com assets estáticos (não Pages), registrado em `processo/git-github-e-ci.md`.

## Roteiro de teste do dono (15 min)
1. No celular, abra https://papeai-app.danielmessias053.workers.dev e instale: no Chrome, menu ⋮ → **Adicionar à tela inicial** / **Instalar app**. Abra pelo ícone e veja que abre sem a barra do navegador.
2. Em **Configurações**, troque o idioma para **English** e volte para **Português**. Troque o tema.
3. Abra https://papeai-app.danielmessias053.workers.dev/robots.txt e veja `Disallow: /`.
4. Abra https://papeai-site.danielmessias053.workers.dev e veja o site institucional.
5. PR de teste com preview: já demonstrado no PR #1 (comentários com os dois links). Opcional repetir.
6. Diga **"aprovado F01"**, **"aprovado com ressalvas F01: …"** ou o que precisa mudar.

## Próxima fase (prévia)
**F02 — Contas, usuários e dados no servidor:** Supabase (região São Paulo), login com Google e com e-mail e senha (ADR-0006), tabelas com RLS e política explícita, privacidade/LGPD. O login com Google vai usar a URL de produção do app como origem autorizada.
