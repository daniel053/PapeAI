# F04 — Tutor em texto: personalidade, correções e memória

> **Status:** ⏳ Não iniciada · **Marco ao final: M1 — "Eu uso"**

## Objetivo
Conversar com o tutor em inglês, com **correções verificadas** (citação literal), os **três modos de feedback**, memória visível/editável, relato de "correção errada", emoção do mascote na resposta e **evals** que sustentam a escolha do modelo padrão.

## Documentos desta fase
1. `../ia/arquitetura-do-tutor.md`
2. `../ia/personalidade-e-modos-de-feedback.md`
3. `../ia/controle-de-alucinacao-do-tutor.md`
4. `../ia/avaliacoes-de-prompts-evals.md`
5. `../ia/economia-de-tokens-e-custos.md`
6. `../pedagogia/metodologia.md`
7. `../dados/modelo-de-dados.md` (`learner_memory`, `feedback_reports`)
8. Skill `claude-api` (structured outputs, streaming, prompt caching, mensagens de sistema no meio da conversa)

## Pré-requisitos
- F03 aprovada. Q-09, Q-10, Q-16, Q-25 respondidas.

## Escopo
**Inclui:** prompts v1 versionados, schemas (`TutorTurn`, `ConversationSummary`, `MemoryDelta`), pipeline de validação, UI de conversa com correções destacadas, modos de feedback com consentimento do sem filtro e botão "baixar o tom", imersão progressiva, resumo rolante, memória de longo prazo (`learner_memory`) e tela "O que o tutor sabe sobre você", `feedback_reports`, transcrições locais com retenção, emoção do mascote (placeholder 2D/emoji), suítes de eval e comparação dos 3 perfis.
**Não inclui:** nivelamento e objetivos (F05), trilha (F06), voz (F07), mascote 3D (F08).

## Passos
### A. Prompts e schemas
- [ ] Arquivos `tutor.v1.md` (núcleo + persona + modos + variante), `summary.v1.md`, `memory.v1.md`.
- [ ] Schemas zod + JSON Schema para `output_config.format`.
- [ ] Ordem das camadas para cache; medir `cache_read_input_tokens`.

### B. Pipeline de validação
- [ ] Recusa/`max_tokens`/schema inválido tratados.
- [ ] Verificação de citação literal + descarte + contador local.
- [ ] Renderização segura (Markdown restrito, sem HTML/imagens, links como texto).

### C. Interface de conversa
- [ ] Mensagens com streaming; correções com destaque "você escreveu / sugestão / por quê".
- [ ] Correções `low` ocultas ("mostrar todas" opcional).
- [ ] Botão "essa correção está errada" → `feedback_reports` (migração + RLS + testes).
- [ ] Mascote placeholder reagindo a `mascot_emotion`.

### D. Modos e ajustes do professor
- [ ] Gentil / Equilibrado / Sem filtro; consentimento do sem filtro em `consent_records`.
- [ ] Botão "baixar o tom"; abrandamento automático (sinais de angústia, erro repetido 3×).
- [ ] Troca de modo via mensagem `{role: "system"}` (sem quebrar o cache).
- [ ] Ajustes: momento, quantidade de correções, idioma das explicações (imersão progressiva).
- [ ] Texto fixo de cuidado para sinais de risco (CVV 188), revisado pelo dono.

### E. Memória
- [ ] Resumo rolante a cada ~8 turnos (local).
- [ ] `learner_memory` (migração, RLS, testes) + `memory.update` ao fim da sessão (só com evidência; sem dados sensíveis).
- [ ] Tela "O que o tutor sabe sobre você": ver, editar, apagar.

### F. Armazenamento local
- [ ] Conversas no IndexedDB por usuário; retenção configurável; "apagar conversas".

### G. Evals e decisão do modelo padrão
- [ ] Suítes: `corrections` (com negativos), `variants`, `mode-compliance`, `memory-honesty`, `culture-hedging`.
- [ ] Runner com estimativa de custo → **aprovação do dono** → rodar nos 3 perfis.
- [ ] Tabela qualidade × custo × latência → dono escolhe o padrão → ADR-0008 **Aceita**.

## Segurança nesta fase
Seção F04 do checklist. Atenção a injeção de prompt e exfiltração por Markdown/imagens.

## Testes e verificações
- Unitários: citação literal, descarte de correções inválidas, normalização, renderização segura.
- E2E: conversa com API simulada (respostas válidas, inválidas e recusas).
- Evals: relatório comparativo anexado ao portão.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Falsos positivos nas correções | Suíte de negativos + `confidence` + regra "na dúvida, não corrija" |
| Modo sem filtro passar do ponto | Regras inegociáveis + suíte `mode-compliance` + abrandamento automático |
| Custo das evals | Estimativa e aprovação prévia; começar pelo perfil Econômico |
| Latência alta no primeiro token | Effort `low`; instrução de começar a resposta imediatamente; medir |

## O que você vai aprender
- Como um prompt é montado em camadas e por que a ordem importa (cache).
- O que são saídas estruturadas e por que reduzem alucinação.
- Como uma eval mede qualidade antes de mudar algo.

## Portão de aprovação F04 (M1)
**Critérios:**
- [ ] Conversa estável com correções verificadas e streaming.
- [ ] Três modos funcionando, com consentimento e "baixar o tom".
- [ ] Memória visível/editável; relato de correção errada funcionando.
- [ ] Evals rodadas e metas iniciais atingidas (ou justificadas); ADR-0008 aceita com o padrão escolhido.
- [ ] Custo médio por conversa medido e registrado em `../ia/economia-de-tokens-e-custos.md`.

**Roteiro de teste do dono (30 min):**
1. Converse 10 minutos em cada modo (gentil, equilibrado, sem filtro).
2. Escreva de propósito 5 frases erradas e 5 certas; confira se as certas **não** são corrigidas.
3. Toque em "essa correção está errada" em uma delas.
4. Abra "O que o tutor sabe sobre você", edite e apague um item.
5. Leia o relatório das evals e escolha o perfil padrão.
6. Diga **"aprovado F04"** — e comemore o M1. 🎉
