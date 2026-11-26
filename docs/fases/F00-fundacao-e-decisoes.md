# F00 — Fundação e decisões

> **Status:** 🚧 Em andamento

## Objetivo
Sair desta fase com: **decisões aprovadas**, **contas de desenvolvedor protegidas**, **ambiente de desenvolvimento pronto no Windows** e **repositório configurado** — sem escrever código de produto ainda.

## Documentos desta fase
1. `../04-PERGUNTAS-EM-ABERTO.md` (perguntas **[bloqueia F00]**)
2. `../decisoes/` (ADRs 0001–0011)
3. `../01-VISAO-DO-PRODUTO.md` e `../03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md` (revisão)
4. `../arquitetura/custos-e-limites.md`
5. `../processo/ambiente-de-desenvolvimento-windows.md`
6. `../processo/fluxo-de-trabalho-vibe-coding.md` e `../processo/git-github-e-ci.md`
7. `../seguranca/checklist-de-seguranca-por-fase.md` (seção F00)

## Pré-requisitos
- Nenhum.

## Escopo
**Inclui:** revisão dos documentos, respostas às perguntas, ADRs aceitas, MFA nas contas, organização/chave de dev na Claude Console (feita pelo dono), ambiente local, higiene do repositório (`.gitignore`, `.gitattributes`, `LICENSE`), configurações de segurança do GitHub, briefing das trilhas paralelas (arte e conteúdo).
**Não inclui:** código do app, projetos no Supabase (criados na F02 para não pausarem à toa), hospedagem (F01).

## Passos
### A. Revisão e decisões
- [ ] Dono lê `01-VISAO-DO-PRODUTO.md` e `fases/README.md`.
- [x] Dono responde as perguntas bloqueantes (Q-01, Q-02, Q-03, Q-04, Q-05, Q-06, Q-07, Q-08, Q-12).
- [x] IA atualiza cada ADR para **Aceita** (ou ajusta conforme a resposta) e os documentos que a ADR lista como afetados.
- [ ] Registrar respostas e interpretações confirmadas (ex.: Q-24) em `03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md`.

### B. Contas e segurança (feito pelo **dono**; a IA orienta, nunca recebe senhas/chaves)
- [ ] GitHub com MFA (de preferência passkey/chave de segurança ou app autenticador).
- [ ] Conta Google com MFA (será usada no Google Cloud e na Play Console).
- [ ] E-mail de recuperação dessas contas também com MFA.
- [ ] Claude Console: organização/workspace só para o PapeAI; **chave de desenvolvimento** com **limite de gasto baixo**; se o plano for Max/Ultra/Team, avaliar o resgate dos créditos de API para essa organização.
- [ ] Anotar no `../seguranca/resposta-a-incidentes.md` (tabela de contas) onde cada conta é gerenciada e se o MFA está ativo — **sem senhas**.

### C. Ambiente de desenvolvimento
- [x] Decidir Q-12 (fica no OneDrive, sync desativado — risco aceito) e, se aprovado, mover o repositório para fora do OneDrive (passo a passo em `../processo/ambiente-de-desenvolvimento-windows.md`).
- [x] Instalar e registrar versões: Git, Node.js **LTS vigente** (confirmar em nodejs.org), pnpm (via Corepack), VS Code + extensões, GitHub CLI.
- [ ] Colar no relatório do portão a saída de `git --version`, `node -v`, `pnpm -v`, `gh --version`.

### D. Repositório
- [x] `git remote -v` (`github.com/daniel053/PapeAI`; público/privado a confirmar) — confirmar o repositório no GitHub e se ele é **público ou privado** (se for público, revisar `docs/03-...` antes do primeiro push — contém comentários pessoais).
- [x] `.gitignore` (Node, `.env*`, build, OS, editores), `.gitattributes` (finais de linha LF), `.editorconfig`.
- [x] `LICENSE` conforme ADR-0005 (e aviso de marca no README).
- [ ] GitHub: secret scanning + **push protection**, Dependabot alerts, relato privado de vulnerabilidades; proteção da branch `main` (configurada de fato na F01, quando houver CI).
- [ ] Primeiro commit da documentação (**com autorização do dono**).

### E. Trilhas paralelas (podem começar já)
- [ ] **Arte:** briefing do mascote (animal escolhido, personalidade, paleta) e primeiros esboços (`../design/mascote-3d.md`).
- [ ] **Conteúdo:** plano de curadoria (quem revisa notas culturais — Q-20) e escolha das listas de vocabulário abertas (ADR-0009).

## Segurança nesta fase
Ver seção F00 de `../seguranca/checklist-de-seguranca-por-fase.md`. Destaques: MFA em tudo, chave de dev com limite, nada de segredo no chat ou no repositório.

## Testes e verificações
- Saídas dos comandos de versão coladas no relatório.
- Prints/confirmação do dono das páginas de segurança das contas (MFA ativo).
- `git status` limpo após o commit autorizado.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| OneDrive sincronizando `node_modules` e `.env` | Mover o repositório (Q-12) antes da F01 |
| Paralisia de decisão | Recomendações em cada pergunta; dá para aceitar e mudar depois via nova ADR |
| Colar a chave no chat por engano | Regra do `CLAUDE.md`; se acontecer, revogar e criar outra |

## O que você vai aprender
- O que é uma ADR e por que registrar decisões.
- Por que MFA nas contas de desenvolvedor é a medida de segurança de maior impacto.
- Como Node.js, pnpm e Git se encaixam.

## Portão de aprovação F00
**Critérios:**
- [x] Perguntas bloqueantes respondidas.
- [x] ADRs 0001–0006 e 0009–0011 **Aceitas**; 0007 e 0008 **Propostas** com momento de decisão definido (F07 e F04).
- [ ] MFA confirmado em todas as contas listadas.
- [x] Ambiente instalado, versões registradas em `../arquitetura/stack-tecnologica.md`.
- [x] Repositório fora do OneDrive (ou risco aceito por escrito). → risco aceito (Q-12).
- [ ] `LICENSE`, `.gitignore`, `.gitattributes` presentes; recursos de segurança do GitHub ativos.
- [ ] `00-ESTADO-ATUAL.md` atualizado.

**Roteiro de teste do dono (10 min):**
1. Abra as páginas de segurança do GitHub, Google e Claude Console e confirme o MFA.
2. Na Console, confirme que a chave de dev tem limite de gasto.
3. No terminal (PowerShell), rode `node -v` e `pnpm -v` e confira que aparecem versões.
4. Leia a lista de ADRs aceitas no `00-ESTADO-ATUAL.md` e confirme que é o que você decidiu.
5. Diga **"aprovado F00"** ou o que precisa mudar.
