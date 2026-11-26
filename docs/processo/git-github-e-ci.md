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

## Modelo de PR (`.github/pull_request_template.md` — F01)
```markdown
## O quê
## Por quê (requisitos/ADR)
## Como testar
## Checklist
- [ ] CI verde
- [ ] Testes adicionados/atualizados
- [ ] Docs atualizados (estado, dados, ADR, stack)
- [ ] Sem segredos/dados pessoais
- [ ] Dependência nova com ficha aprovada (se houver)
- [ ] Migração segue o checklist (se houver)
## Riscos
```

## CI (GitHub Actions — esboço para a F01)
| Job | Quando | O que faz |
|---|---|---|
| `lint` | PR e `main` | ESLint + Prettier (check) |
| `typecheck` | PR e `main` | `tsc --noEmit` |
| `unit` | PR e `main` | Vitest |
| `build` | PR e `main` | Build de `app/` e `site/` |
| `e2e` | PR e `main` | Playwright (smoke; depois as provas de segurança) |
| `secrets` | PR e `main` | gitleaks |
| `deps` | PR e semanal | Auditoria de dependências (OSV/`pnpm audit`) |
| `codeql` | PR e semanal | Análise estática (repositório público) |
| `rls` | PR que toca `supabase/` (F02+) | Testes de RLS contra o projeto de dev (secrets protegidos) |
| `assets` | PR que toca `art/` ou modelos (F08+) | Orçamento do `.glb` (triângulos, tamanho, clipes) |

Regras de segurança das Actions:
- `permissions:` mínimas por workflow (padrão `contents: read`).
- Actions de terceiros **fixadas por SHA** do commit (não por tag).
- Segredos só em *environments* protegidos; nunca em workflows acionados por PR de fork.
- Nenhum segredo impresso em log.

## Configurações do repositório no GitHub
- [ ] Secret scanning + **push protection**.
- [ ] Dependabot alerts + security updates; `dependabot.yml` para npm e GitHub Actions (semanal).
- [ ] Relato privado de vulnerabilidades (*private vulnerability reporting*).
- [ ] CodeQL (quando público).
- [ ] Proteção da `main`: PR obrigatório, checks obrigatórios, sem push direto, sem *force push*.
- [ ] Merge por squash; apagar branch após merge.

## Tags e versões
- Portões: `fase-NN-aprovada` (com autorização).
- Versões do app: SemVer (`v0.1.0` no M1, `v0.5.0` no M2, `v1.0.0` no M4).
- `CHANGELOG.md` a partir da F09 (beta).

## Hooks locais
- Pré-commit: gitleaks (e formatação rápida).
- Hook do Claude Code para bloquear gravação de padrões de chave em arquivos (SEG-17) — configurar com a skill `update-config`, só com aprovação.
