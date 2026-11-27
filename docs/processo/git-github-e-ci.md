# Git, GitHub e CI

## Branches
- `main`: sempre estável e implantável; **protegida** (PR obrigatório + CI verde).
- Trabalho em branches curtas: `fase-NN/<tarefa-curta>` (ex.: `fase-03/vault-web`).
- Um PR por tarefa ou grupo pequeno de tarefas; merge por *squash*.

## Commits (em inglês, Conventional Commits)
```text
feat(vault): encrypt api key with non-extractable AES-GCM key
fix(auth): use generic message for unknown email
docs(data): add learner_memory to data model
test(rls): cover feedback_reports for anon and other user
chore(deps): bump vitest
```
- Mencionar IDs de requisito no corpo quando útil (`Refs: BYOK-05`).
- Commit/push **só com autorização do dono**.

## Modelo de PR
Arquivo: `.github/pull_request_template.md` (criado na F01). Seções: **O quê**, **Por quê** (fase, requisitos, ADR), **Como testar** (com evidência), **Checklist** dividido em *Evidência*, *Documentação*, *Segurança* e *Escopo* (baseado em `definicao-de-pronto.md`) e **Riscos**.

## O que existe no repositório (F01)
| Arquivo | Para que serve |
|---|---|
| `.github/workflows/ci.yml` | CI de todo PR e de todo push na `main` |
| `.github/workflows/codeql.yml` | Análise estática CodeQL (código TS/JS **e** os próprios workflows) |
| `.github/workflows/deploy.yml` | Deploy na Cloudflare: produção na `main`, preview por PR, limpeza do preview ao fechar o PR |
| `.github/actions/setup-workspace/action.yml` | Passo reutilizado: instala pnpm (versão do `packageManager`), Node (versão do `.nvmrc`) e as dependências com lockfile congelado |
| `.github/dependabot.yml` | Atualizações semanais de npm e GitHub Actions, agrupadas, com *cooldown* |
| `.github/pull_request_template.md` | Modelo de descrição de PR (pt-BR) |
| `.gitleaks.toml` | Regras do gitleaks: as padrão + regra extra para chaves `sk-ant-` + exceção para chaves de teste com marcador `FAKE` |
| `tooling/git-hooks/pre-commit` | Hook local que roda o gitleaks nas mudanças preparadas (*staged*) antes de cada commit |
| `app/wrangler.jsonc`, `site/wrangler.jsonc` | Configuração dos dois Workers da Cloudflare (`papeai-app`, `papeai-site`) |
| `package.json` → script `hooks:install` | Liga os hooks locais (`git config core.hooksPath tooling/git-hooks`). **Não roda sozinho**: o dono decide |

## CI (GitHub Actions)
Os nomes da coluna **Check** são exatamente os que aparecem no PR e os que devem ser marcados como obrigatórios na proteção da `main`.

| Workflow | Check | Quando | O que faz |
|---|---|---|---|
| CI | `lint` | PR e `main` | `pnpm lint` (ESLint, inclusive as regras de fronteira/segurança) |
| CI | `format` | PR e `main` | `pnpm format:check` (Prettier, só verifica) |
| CI | `typecheck` | PR e `main` | `pnpm typecheck` (`tsc` de cada pacote) |
| CI | `unit` | PR e `main` | `pnpm test` (Vitest) |
| CI | `build` | PR e `main` | `pnpm build` + confere que `_headers` e `robots.txt` chegaram em `app/dist` e `site/dist` |
| CI | `audit` | PR e `main` | `pnpm audit --prod --audit-level moderate` (dependências que rodam no navegador: falha a partir de *moderate*), `pnpm audit --audit-level high` (todas, inclusive ferramentas de build: falha a partir de *high*) e `pnpm audit signatures` (assinaturas do registro npm) |
| CI | `secrets` | PR e `main` | gitleaks em **todo o histórico** do git, com segredos mascarados no log (`--redact`) |
| CodeQL | `analyze (javascript-typescript)` e `analyze (actions)` | PR, `main` e toda segunda-feira | CodeQL `build-mode: none`; resultados na aba *Security* |
| Deploy | `deploy-build`, `deploy-production (app/site)`, `deploy-preview (app/site)`, `deploy-preview-cleanup (app/site)` | `main` / PR | Ver seção Deploy. **Não** marcar como obrigatórios (são pulados em PRs de fork e do Dependabot) |

Saída local verificada em 2026-11-26 (pnpm 12.23.0): `pnpm audit --prod --audit-level moderate` → "No known vulnerabilities found" (exit 0); `pnpm audit --audit-level high` → 2 *moderate* em `glob`/`minimatch` via `workbox-build` (exit 0, abaixo do limite); `pnpm audit signatures` → "549 packages have verified registry signatures".

**E2E (Playwright) ainda não está na CI.** A dependência não foi aprovada pelo dono. Quando for aprovada (ficha em `../arquitetura/stack-tecnologica.md`), entra um job `e2e` no `ci.yml` (smoke + cabeçalhos + `robots.txt` + axe) e ele passa a ser check obrigatório. Não deixamos job "vazio" esperando.

Fases seguintes (planejado, ainda não existe): `rls` (PR que toca `supabase/`, F02+) e `assets` (orçamento do `.glb`, F08+).

### Regras de segurança das Actions (aplicadas)
- `permissions: contents: read` no topo de todo workflow. Só sobe por job quando precisa: `security-events: write` (só o job do CodeQL) e `pull-requests: write` (só o job que comenta o link do preview).
- Toda action de terceiros fixada por **SHA completo do commit** com comentário `# vX.Y.Z`; a imagem do gitleaks fixada por **digest** `sha256`.
- `actions/checkout` com `persist-credentials: false` (o token não fica gravado no disco do runner).
- `concurrency` cancela execuções antigas do mesmo PR (o deploy de produção nunca é cancelado no meio).
- Valores vindos do evento (número do PR, URL) passam por variáveis de ambiente, nunca colados direto no script (evita injeção).
- Segredos da Cloudflare só nos *environments* `production` e `preview`; nunca disponíveis para PR de fork; o job que roda código do projeto (`deploy-build`) **não** recebe segredo nenhum.
- Nenhum segredo impresso em log (gitleaks com `--redact`; o deploy só verifica se o segredo existe, sem mostrá-lo).

### Versões fixadas (verificadas em 2026-11-26)
Como verificamos: `gh api repos/<dono>/<repo>/releases/latest` (versão atual) e `gh api repos/<dono>/<repo>/git/ref/tags/<tag>` (tags anotadas desreferenciadas com `gh api .../git/tags/<sha>`), conferido com `gh api repos/<dono>/<repo>/commits/<tag>`.

| Action / imagem | Versão | SHA do commit / digest |
|---|---|---|
| `actions/checkout` | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| `actions/setup-node` | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| `pnpm/action-setup` | v6.1.1 | `73e46992e05b19abd31f2f3c20e0e7370d762115` (tag anotada) |
| `actions/upload-artifact` | v7.0.2 | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |
| `actions/download-artifact` | v8.0.2 | `9000827ccba6bdab643e8b6fd33ac0654aef8333` |
| `github/codeql-action` (`init`, `analyze`) | v4.39.5 | `915412ff23e8b7659517e607487dbeae018f2934` (tag anotada) |
| `cloudflare/wrangler-action` | v4.1.3 | `953926a2e2182532811c01a25e53647d93bf07c0` (tag anotada) |
| `ghcr.io/gitleaks/gitleaks` (imagem Docker) | v8.30.1 | `sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f` (digest do índice multi-arquitetura, lido do ghcr.io) |
| Wrangler (instalado pela action) | 4.168.0 | versão exata em `deploy.yml` (`npm view wrangler dist-tags` → `latest`, publicado em 2026-11-24) |

O Dependabot atualiza os SHAs e os comentários das actions. **Não** atualiza a imagem do gitleaks nem `WRANGLER_VERSION`: revisar à mão a cada fase.

### Por que gitleaks via imagem Docker e não a `gitleaks/gitleaks-action`
A `gitleaks-action` (v3.0.0) tem licença própria desde a v2 (não é open source); é gratuita para contas pessoais, mas exige `GITLEAKS_LICENSE` para organizações. A ferramenta gitleaks em si é **MIT**. Usamos a imagem oficial `ghcr.io/gitleaks/gitleaks` fixada por digest, rodando **sem rede** (`--network none`): sem chave de licença, sem código JavaScript de terceiros e sem risco de quebrar se o repositório for movido para uma organização. Fonte: README da `gitleaks/gitleaks-action` v3.0.0 e `LICENSE` do `gitleaks/gitleaks` v8.30.1 (lidos via `gh api` em 2026-11-26).

### Regras do gitleaks (`.gitleaks.toml`)
- Estende as regras padrão (`useDefault = true`). As padrão já incluem `anthropic-api-key` (`sk-ant-api03-…`) e `anthropic-admin-api-key` (`sk-ant-admin01-…`), mas exigem o tamanho exato.
- Regra extra `papeai-anthropic-key-any`: qualquer `sk-ant-` seguido de 20+ caracteres de chave (pega outros tipos, colagens cortadas e formatos futuros).
- Exceção: chaves **obviamente falsas** em arquivos de teste (`*.test.ts`, pastas `tests/`, `fixtures/`…) **e** que contenham o marcador `FAKE` (ex.: `sk-ant-api03-FAKE…`). Chave com cara de real em teste continua sendo bloqueada.
- Falso positivo pontual: usar `.gitleaksignore` (com o *fingerprint* que o gitleaks mostra) e explicar no PR.

## Dependabot (`.github/dependabot.yml`)
- `npm` na raiz `/` (o pnpm usa o ecossistema `npm`; pnpm v12 consta como suportado na página de ecossistemas do GitHub) e `github-actions` (`/` e `/.github/actions/*`).
- Semanal (segunda, 06:00 de Brasília), no máximo 5 PRs abertos por ecossistema.
- Minor e patch agrupados em um PR por ecossistema; major vem separado.
- `cooldown`: espera 3 dias depois da publicação (7 para major) antes de propor. Motivo: o pnpm 12 recusa versões com menos de 24 h (`minimumReleaseAge`), então um PR com versão mais nova não instalaria; e alguns dias dão tempo para a comunidade detectar um pacote malicioso. O *cooldown* **não** atrasa atualizações de segurança.
- Prefixos de commit: `chore(deps)` e `chore(ci)`.
- Fonte: [Dependabot options reference](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference) e [Supported ecosystems](https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories) (lidos em 2026-11-26).

## Deploy na Cloudflare (`.github/workflows/deploy.yml`)
### Decisão: Workers com assets estáticos (não Pages)
Resolve o "Pages x Workers" deixado em aberto na ADR-0004 (o coordenador registra a ADR). Fontes lidas em 2026-11-26:
- A página inicial da documentação do Pages diz que Workers é a plataforma principal e que projetos novos devem começar com Workers ([developers.cloudflare.com/pages](https://developers.cloudflare.com/pages/), atualizada em 2026-08-25).
- Workers com assets estáticos suportam `_headers` e `_redirects` nativamente, na pasta de assets ([guia de migração Pages → Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/), 2026-11-12).
- `_headers`: arquivo sem extensão na pasta de assets (para nós, `public/_headers`, que o Vite copia para `dist/`); até 100 regras; 2.000 caracteres por linha; **não** se aplica a respostas geradas por código de Worker — não temos código de Worker, só assets ([Headers](https://developers.cloudflare.com/workers/static-assets/headers/), 2026-11-12).
- SPA: `assets.not_found_handling = "single-page-application"` devolve `/index.html` com 200 para rotas desconhecidas; `main` é opcional para Workers só de assets ([SPA](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/), 2026-10-12; [Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)). O site usa `"none"` (404 de verdade).
- Requisições a assets estáticos são gratuitas e ilimitadas ([Billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), 2026-11-12).
- `compatibility_date`: a Cloudflare recomenda a data atual para projetos novos ([Compatibility dates](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)). Usamos `2026-11-24`, a data de lançamento do Wrangler 4.168.0 fixado, para nunca ficar à frente da ferramenta.

### Preview por PR: Worker Previews
- A Cloudflare recomenda **Previews** (`wrangler preview`) para testar branches/PRs; *Version URLs* (`wrangler versions upload`) usam os recursos de produção e não servem para isso ([Compare workflows](https://developers.cloudflare.com/workers/previews/compare-workflows/), 2026-11-19).
- Precisa do bloco `previews` no `wrangler.jsonc` (pode ser vazio) ([Configuration](https://developers.cloudflare.com/workers/previews/configuration/), 2026-09-22) e do Wrangler ≥ 4.136.3 pela action ([README da wrangler-action v4.1.3](https://github.com/cloudflare/wrangler-action/tree/v4.1.3)).
- Plano gratuito: 100 Previews por Worker (o mais antigo é apagado automaticamente); URL `<nome-do-preview>-<worker>.<subdominio>.workers.dev` ([Previews](https://developers.cloudflare.com/workers/previews/), 2026-09-24). Para nós: `pr-<número>-papeai-app.<subdominio>.workers.dev`.
- Links de preview são **públicos** (como a produção). O app não guarda segredo do servidor, então isso é aceitável; se um dia for preciso, dá para proteger com Cloudflare Access.

### Como o workflow funciona
1. `deploy-build` (sem segredos): instala, roda `pnpm build` e empacota só `wrangler.jsonc` + `dist/` de cada Worker num artefato.
2. `deploy-production (app|site)` no push na `main` (environment `production`): baixa o artefato e roda `wrangler deploy`.
3. `deploy-preview (app|site)` em PR do próprio repositório (environment `preview`): `wrangler preview --name pr-<número>`, escreve o link no resumo do job e mantém **um comentário por Worker** no PR (atualizado a cada push).
4. `deploy-preview-cleanup (app|site)` ao fechar o PR: `wrangler preview delete --name pr-<número> --skip-confirmation`.
5. **Sem os segredos** (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) — ou em PR de fork/Dependabot — cada job mostra um aviso "Deploy skipped" e termina verde.

Os jobs de deploy não fazem checkout nem instalam o projeto: só rodam o Wrangler (versão exata) pela action oficial da Cloudflare. Assim, o código de terceiros que roda no build nunca vê o token.

### Não verificado (a confirmar no primeiro deploy)
- `[SUPOSIÇÃO]` O primeiro Preview pode exigir que o Worker já exista. Por isso o roteiro abaixo faz o primeiro deploy de **produção** antes de abrir um PR de teste.
- `[SUPOSIÇÃO]` Permissão mínima do token = **Workers Scripts: Edit** na conta. A doc oficial cita o modelo "Edit Cloudflare Workers" (que também dá KV, R2, Routes e Tail — mais do que precisamos). Se o deploy falhar por permissão, ler o erro e adicionar só o que ele pedir.
- `[SUPOSIÇÃO]` Os cabeçalhos do `_headers` também valem para a resposta de fallback da SPA (a doc não diz). Verificar com `curl -I https://<app>/rota-inexistente` no portão.
- Os workflows não foram executados ainda (nada foi enviado ao GitHub). A validação local foi: análise de sintaxe dos YAML/JSONC com o parser do Prettier, `pnpm lint` e `pnpm format:check`.
- Melhoria futura (precisa de aprovação + ficha): colocar `wrangler` como `devDependency` fixada no lockfile, para o deploy usar a mesma versão auditada e protegida pelo `minimumReleaseAge`.

## Checklist do dono (só você pode fazer)
> Nunca cole tokens, senhas ou IDs secretos no chat. Se colar sem querer, revogue o token na hora.

**1. Cloudflare — conta**
- [ ] Criar a conta em `dash.cloudflare.com` e ativar a **verificação em duas etapas (MFA)** no perfil.
- [ ] Em *Workers & Pages*, escolher o subdomínio gratuito `*.workers.dev` quando o painel pedir (ele vira parte das URLs).
- [ ] Copiar o **Account ID** (aparece na página inicial da conta / *Workers & Pages*; guia oficial: "Find account and zone IDs").
- Não precisa criar os projetos à mão: o primeiro deploy cria os Workers `papeai-app` e `papeai-site`.

**2. Cloudflare — token de API com o mínimo de permissão**
- [ ] *Manage Account → API Tokens* (token da conta) → *Create Token* → **Custom token**.
- [ ] Permissão: **Account → Workers Scripts → Edit**. Recursos: **só a sua conta**. Opcional: data de validade.
- [ ] Copiar o token (aparece uma vez só) direto para o GitHub, no passo 3.

**3. GitHub — environments e segredos**
- [ ] *Settings → Environments → New environment* `production`. Em *Deployment branches*, escolher **Selected branches** e adicionar só `main`.
- [ ] Criar o environment `preview` (todas as branches).
- [ ] Em **cada** environment, adicionar os segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. Pelo terminal (você digita o valor quando ele pedir): `gh secret set CLOUDFLARE_API_TOKEN --env production` (repita para o outro segredo e para `--env preview`).

**4. GitHub — segurança do repositório** (*Settings → Code security*)
- [ ] Secret scanning + **push protection**.
- [ ] Dependabot alerts + Dependabot security updates.
- [ ] *Private vulnerability reporting*.
- [ ] CodeQL: **não** ativar o "Default setup" — já usamos o workflow próprio (`codeql.yml`); os dois juntos entram em conflito.
- [ ] *Settings → Actions → General*: permissões do `GITHUB_TOKEN` = **Read repository contents**; desmarcar "Allow GitHub Actions to create and approve pull requests"; exigir aprovação para workflows de PR de fork.

**5. GitHub — proteção da `main`** (*Settings → Rules → Rulesets → New branch ruleset*, alvo: branch padrão)
- [ ] Exigir pull request antes do merge (0 aprovações, já que você trabalha sozinho; a revisão é você testando).
- [ ] Exigir status checks, com a branch atualizada, marcando exatamente: `lint`, `format`, `typecheck`, `unit`, `build`, `audit`, `secrets`, `analyze (javascript-typescript)`, `analyze (actions)`. (Os checks só aparecem na lista depois de rodarem uma vez — abra o PR da F01 antes.)
- [ ] Bloquear *force push* e exclusão da branch.
- [ ] *Settings → General*: permitir só *squash merge* e apagar a branch após o merge.

**6. Primeiro deploy e teste**
- [ ] Fazer o merge do PR da F01 na `main` → conferir na aba *Actions* que `deploy-production (app)` e `(site)` passaram e abrir as duas URLs.
- [ ] Abrir um PR de teste → ver o comentário com os dois links de preview → fechar o PR e ver o `deploy-preview-cleanup` apagar os previews.

**7. Opcional — gitleaks na sua máquina**
- [ ] Instalar o gitleaks (release oficial em `github.com/gitleaks/gitleaks/releases`, conferindo o checksum, ou pelo gerenciador de pacotes do Windows).
- [ ] Rodar `pnpm hooks:install` uma vez. A partir daí, todo `git commit` verifica segredos. Sem o gitleaks instalado, o hook só avisa e deixa o commit passar (a CI continua verificando).
- [ ] No primeiro commit destes arquivos: `git add --chmod=+x tooling/git-hooks/pre-commit` (deixa o hook executável no Linux/macOS; no Windows já funciona).

## Configurações do repositório no GitHub (resumo)
- [ ] Secret scanning + **push protection**.
- [ ] Dependabot alerts + security updates; `dependabot.yml` para npm e GitHub Actions (semanal). *(arquivo pronto)*
- [ ] Relato privado de vulnerabilidades (*private vulnerability reporting*).
- [ ] CodeQL (workflow próprio pronto; não ativar o *default setup*).
- [ ] Proteção da `main`: PR obrigatório, checks obrigatórios, sem push direto, sem *force push*.
- [ ] Merge por squash; apagar branch após merge.

## Tags e versões
- Portões: `fase-NN-aprovada` (com autorização).
- Versões do app: SemVer (`v0.1.0` no M1, `v0.5.0` no M2, `v1.0.0` no M4).
- `CHANGELOG.md` a partir da F09 (beta).

## Hooks locais
- **Pré-commit (pronto):** `tooling/git-hooks/pre-commit` roda `gitleaks git --pre-commit --staged --redact` (comando atual desde o gitleaks 8.19; o antigo `protect --staged` fica como alternativa para versões velhas). Ligar com `pnpm hooks:install` (decisão do dono).
- **Hook do Claude Code anti-padrão-de-chave (SEG-17): só proposta**, ver abaixo.

### Proposta SEG-17 — hook do Claude Code que bloqueia padrões de chave (aguarda aprovação)
**Objetivo:** impedir que a IA grave uma chave real em qualquer arquivo do repositório, mesmo por engano (ex.: copiar de uma mensagem, de um log ou de um `.env`). Complementa o gitleaks: o gitleaks age no commit; este hook age **antes** de o arquivo ser escrito.

**O que verificaria**
- Evento `PreToolUse` para as ferramentas que escrevem arquivos (`Write`, `Edit`, `MultiEdit`, `NotebookEdit`) e para `Bash` (comandos como `echo ... > arquivo`).
- Procura no conteúdo novo (`content`, `new_string`, `command`) os padrões: `sk-ant-[A-Za-z0-9_-]{20,}` (Anthropic) e, a partir da F07, os formatos das chaves dos provedores de voz BYOK.
- Mesma exceção do gitleaks: arquivo de teste **e** marcador `FAKE` → permitido.
- Se encontrar: bloqueia a ação (código de saída 2) e explica à IA o motivo, **sem repetir o valor**.
- Opcional: evento `UserPromptSubmit` que detecta uma chave colada no chat, bloqueia a mensagem e lembra o dono de revogá-la (regra inviolável 4).

**Onde ficaria**
- Script sem dependências: `.claude/hooks/block-key-patterns.mjs` (Node, lê o JSON do evento na entrada padrão).
- Registro em `.claude/settings.json` (versionado, vale para quem clonar), configurado com a skill `update-config`.

**Como testar**
- Testes unitários (Vitest) chamando o script com JSONs de exemplo: chave falsa com formato real fora de teste → bloqueia; mesma chave com `FAKE` em `*.test.ts` → permite; texto comum → permite; o valor nunca aparece na mensagem de erro.
- Teste manual: pedir à IA para criar um arquivo com uma chave de formato válido (inventada, sem `FAKE`) e ver o bloqueio.

**Antes de configurar:** reler a documentação oficial atual de hooks do Claude Code (formato do JSON de entrada e códigos de saída) e pedir a aprovação do dono — mexe na configuração da própria IA.
