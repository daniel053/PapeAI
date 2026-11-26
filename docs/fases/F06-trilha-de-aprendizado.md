# F06 — Trilha de aprendizado, revisão espaçada e progresso

> **Status:** ⏳ Não iniciada

## Objetivo
Lições diárias **personalizadas pelo objetivo**, geradas dentro de regras e validadas, revisão espaçada (FSRS), XP/meta/sequência éticos, progresso visível, re-nivelamento mensal e subida de nível.

## Documentos desta fase
1. `../pedagogia/trilha-e-curriculo.md`
2. `../pedagogia/metodologia.md`
3. `../pedagogia/personalizacao-por-objetivo.md`
4. `../pedagogia/idiomas-extensiveis.md`
5. `../ia/economia-de-tokens-e-custos.md` e `../ia/controle-de-alucinacao-do-tutor.md` (H5, H6, H10)
6. `../dados/modelo-de-dados.md` (tabelas da trilha) e `../dados/evolucao-e-migracoes.md`
7. ADR-0009 (conteúdo curado + licenças)

## Pré-requisitos
- F05 aprovada. Q-20 respondida (quem revisa conteúdo cultural).

## Escopo
**Inclui:** conteúdo (`syllabus.json` com esqueleto de todos os níveis e detalhe de A1–B1; vocabulário com licença; `l1/pt-BR.json`; pacotes `profession.software_developer`, `country.au`, `travel.*` revisados), migrações (`lesson_progress`, `vocabulary_cards`, `review_logs`, `daily_activity`, `streaks`, `record_activity`), motor de lições (montagem do `LessonSpec`, `lesson.generate`, validador, reservas, cache), atividades de texto do catálogo, revisão FSRS (inclusive offline), gamificação ética, tela de progresso e histórico, re-nivelamento mensal e verificação de subida de nível.
**Não inclui:** atividades de voz (F07), e-mails/lembretes (F09).

## Passos
### A. Conteúdo (trilha paralela de conteúdo deságua aqui)
- [ ] Escolher listas de vocabulário abertas e registrar licenças (ADR-0009).
- [ ] `syllabus.json` (todos os níveis em esqueleto; A1–B1 detalhados).
- [ ] `l1/pt-BR.json` a partir de `../pedagogia/metodologia.md`.
- [ ] Pacotes temáticos iniciais com `status` de curadoria; fatos culturais com fonte e revisão humana.
- [ ] Lições de reserva curadas (pelo menos 1 por unidade de A1–A2).

### B. Dados
- [ ] Migrações das tabelas da trilha + função `record_activity` (posse, limites, recálculo de sequência) + testes de RLS e da função.

### C. Motor de lições
- [ ] Montagem do `LessonSpec` (entrelaçamento núcleo/objetivo, prioridades, memória do aluno).
- [ ] `lesson.generate` com `count_tokens` antes de gerar; schema `LessonContent`.
- [ ] Validador (gabaritos, vocabulário-alvo, tamanho por nível, conteúdo proibido) + reservas.
- [ ] Cache local de lições.

### D. Atividades (texto)
- [ ] Componentes: cartões SRS, múltipla escolha, lacunas, ordenar frase, tradução, leitura, escrita guiada (`writing.correct`), roleplay por cenário, caça ao erro, mini-debate (B2+).

### E. Revisão espaçada
- [ ] Verificar e integrar a biblioteca FSRS (ficha de dependência); agendamento; tela de revisão; funciona offline e sincroniza.
- [ ] Novas palavras da conversa (`new_vocabulary`) viram cartões (com confirmação do aluno).

### F. Gamificação e progresso
- [ ] XP, anel da meta diária, sequência com proteção e modo férias, conquistas.
- [ ] Tela de progresso: nível, habilidades, linha do tempo, retrato do mês.

### G. Adaptação e níveis
- [ ] Regras de adaptação (reforço, "testar e pular", replanejamento ao mudar objetivo, pacote de viagem por data).
- [ ] Re-nivelamento mensal e conversa de verificação para subir de nível.

### H. Evals
- [ ] Suíte `lesson-validity` (taxa de lições aprovadas pelo validador; amostra revisada pelo dono).

## Segurança nesta fase
Seção F06 do checklist (`record_activity` segura; conteúdo validado antes de exibir; cache isolado por usuário).

## Testes e verificações
- Unitários: montagem do `LessonSpec`, validador, FSRS (agenda em dias simulados), sequência (fusos, proteção, férias).
- E2E: lição completa com API simulada; revisão offline → sincronização.
- Medir custo médio de geração de lição e registrar.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Conteúdo gerado com erro | Validador + reservas + revisão humana dos pacotes |
| Custo de geração alto | Cache, `count_tokens`, lições curtas, Batch no futuro (BL-10) |
| Licenças de listas de vocabulário | Só listas abertas registradas (ADR-0009) |
| Trilha "genérica" demais | Entrelaçamento 60/40 e revisão com 2 personas |

## O que você vai aprender
- Como funciona a revisão espaçada e o algoritmo FSRS.
- Como transformar um currículo em dados (JSON) que o código entende.

## Portão de aprovação F06
**Critérios:**
- [ ] Duas semanas de lições geradas para 2 personas (dev; Austrália) revisadas e aprovadas pelo dono.
- [ ] Revisão espaçada funcionando (inclusive offline).
- [ ] Sequência, meta e XP seguindo as regras éticas.
- [ ] Progresso e histórico visíveis; subida de nível testada.
- [ ] Pacotes publicados só com revisão humana.

**Roteiro de teste do dono (40 min, pode ser em 2 dias):**
1. Faça 3 lições como "dev" e 3 como "Austrália" (contas de teste).
2. Confira se o tema do objetivo aparece de verdade nas lições.
3. Coloque o celular em modo avião e faça uma revisão; volte a ficar online e veja sincronizar.
4. Ative o modo férias e confira que a sequência não quebra.
5. Diga **"aprovado F06"** ou o que precisa mudar.
