# F05 — Onboarding, objetivos e nivelamento

> **Status:** ⏳ Não iniciada

## Objetivo
Do primeiro acesso à trilha: onboarding completo (idioma nativo, idioma-alvo, **objetivos com detalhes**, meta diária, sotaque, modo do professor, legendas) e o **bate-papo de nivelamento** com agregador determinístico, resultado com evidências e objetivos editáveis a qualquer momento.

## Documentos desta fase
1. `../pedagogia/nivelamento-conversa.md`
2. `../pedagogia/personalizacao-por-objetivo.md`
3. `../design/ux-telas-e-acessibilidade.md`
4. `../dados/modelo-de-dados.md` (`goals`, `placement_results`, `learning_profiles`)
5. `../ia/controle-de-alucinacao-do-tutor.md` (H8) e `../ia/avaliacoes-de-prompts-evals.md` (suíte `placement`)

## Pré-requisitos
- F04 aprovada. Q-21 respondida.

## Escopo
**Inclui:** migrações de `goals` e `placement_results` + campos de `learning_profiles`, telas do onboarding, banco de perguntas curado, prompt `placement.v1.md` e schema `PlacementTurn`, agregador em código com testes, tela de resultado, transcrição local, Configurações → Objetivos, suíte de eval `placement`.
**Não inclui:** etapa de voz do nivelamento (F07), geração da trilha (F06).

## Passos
### A. Dados
- [ ] Migrações `goals` e `placement_results` (FKs compostas, checks, RLS, grants) + testes de RLS.
- [ ] Atualizar `../dados/modelo-de-dados.md` e changelog.

### B. Onboarding
- [ ] Telas na ordem de `../design/ux-telas-e-acessibilidade.md`; cada passo pulável onde fizer sentido; progresso visível.
- [ ] Objetivos múltiplos com prioridade; detalhes por tipo (profissão, país/cidade, data, interesses).
- [ ] Aviso em campos livres: "não inclua dados sensíveis".
- [ ] Mensagem "Vá pronto para o que você quer fazer" na tela de objetivos.

### C. Nivelamento
- [ ] `content/languages/en/placement/questions.json` (banco curado por faixa).
- [ ] Prompt `placement.v1.md` + schema `PlacementTurn` + verificação de citações.
- [ ] Agregador (`core/learning/placement-aggregator.ts`) com parâmetros em `config/placement.ts`.
- [ ] Testes unitários do agregador com sequências sintéticas (convergência, parada, peso zero para português, sem evidência).
- [ ] Caminho "sou iniciante total".
- [ ] Transcrição só local; servidor recebe resultado + até 12 citações curtas.

### D. Resultado
- [ ] Tela com nível/subnível, confiança, can-do, pontos fortes com citações, 3 focos, aviso de estimativa.
- [ ] Gravação em `learning_profiles` (`level_source = placement`).

### E. Objetivos a qualquer momento
- [ ] Configurações → Objetivos: adicionar, editar, pausar, remover; aviso de replanejamento (efetivo na F06).

### F. Evals
- [ ] Suíte `placement` com transcrições sintéticas rotuladas (uma por subnível, no mínimo) → calibrar `σ`, pesos e limiares.

## Segurança nesta fase
Seção F05 do checklist (campos livres limitados; transcrição local).

## Testes e verificações
- Unitários do agregador (cobertura alta — é a "nota" do aluno).
- E2E do onboarding completo com API simulada.
- Eval `placement`: ≥ 80% dentro de ±1 subnível (meta inicial).

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Nivelamento longo e cansativo | Limite de 12 turnos; parada por confiança; "pode parar quando quiser" |
| IA "dar nota" inconsistente | Agregador em código; citações verificadas |
| Iniciante total constrangido | Saída honrosa logo no início |
| Onboarding com perguntas demais | Passos puláveis; perguntas de detalhe só quando relevantes |

## O que você vai aprender
- Como uma estimativa por probabilidade (atualização bayesiana simples) chega a um nível.
- Por que separar "quem conversa" (IA) de "quem decide" (código).

## Portão de aprovação F05
**Critérios:**
- [ ] Onboarding completo e editável depois.
- [ ] Nivelamento adaptativo com resultado e evidências coerentes.
- [ ] Agregador testado; eval `placement` dentro da meta (ou justificativa).
- [ ] RLS das novas tabelas testado.

**Roteiro de teste do dono (30 min):**
1. Faça o onboarding como "dev que quer trabalhar remoto" e o nivelamento respondendo do seu jeito.
2. Crie outra conta de teste e faça como "viagem para a Austrália", respondendo de propósito em nível bem básico.
3. Em uma das conversas, responda uma vez em português e veja o lembrete.
4. Confira se as citações no resultado são frases suas de verdade.
5. Edite os objetivos nas Configurações.
6. Diga **"aprovado F05"** ou o que precisa mudar.
