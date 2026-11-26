# Personalização por objetivo — "Vá pronto para o que você quer fazer"

> **Mensagem do produto (OBJ-07):** *Guiamos seu aprendizado para o seu objetivo — não apenas para pronunciar a língua. Vá pronto para o que você quer fazer.*

## Tipos de objetivo e o que perguntamos (OBJ-01/02)
| Objetivo (`goal_kind`) | Perguntas do onboarding | Exemplo de uso na trilha |
|---|---|---|
| `work` — Trabalho | Profissão (lista + "outra"), contexto (reuniões, e-mails, entrevistas, atendimento), país/empresa | Dev: daily, code review, entrevista técnica |
| `travel` — Viagem | País, cidade(s), data, duração, tipo (turismo, família, intercâmbio) | Aeroporto, hotel, restaurante, transporte, emergências |
| `relocation` — Mudança | País, cidade, data, trabalho/estudo | Alugar imóvel, banco, médico, vizinhos, trabalho |
| `study` — Estudos | País, tipo (curso de idioma, graduação, intercâmbio) | Sala de aula, colegas, apresentações |
| `exam` — Exame (futuro) | Qual exame | Prática no formato (sem promessa oficial) |
| `culture` — Cultura | Séries, filmes, música, jogos, livros, esportes | Diálogos e vocabulário dos interesses |
| `hobby` / `family` / `other` | Texto livre curto | Conversas sobre o tema |

Pode haver **vários objetivos** com prioridades (1–5). Editáveis **a qualquer momento** em Configurações → Objetivos (OBJ-03).

## Lista inicial de profissões (`profession_code`)
`software_developer`, `data_analyst`, `designer`, `product_manager`, `it_support`, `healthcare`, `nursing`, `hospitality`, `food_service`, `retail_sales`, `customer_support`, `marketing`, `engineering`, `education`, `finance`, `logistics`, `construction`, `beauty_wellness`, `student`, `other`.

## Pacotes temáticos (OBJ-04)
```text
content/themes/
├─ profession.software_developer/
│  ├─ manifest.json        # id, títulos, níveis cobertos, status de curadoria
│  ├─ vocabulary.json      # itens por nível (term, meaning_pt, example, cefr)
│  ├─ scenarios.json       # roleplays: objetivo, papéis, checklist de sucesso, nível mínimo
│  ├─ phrases.json         # frases úteis por situação
│  └─ facts.json           # (quando houver fatos) { fact, source_url, reviewed_at, reviewed_by }
├─ country.au/
├─ country.us/ country.gb/ country.ca/ country.ie/ country.nz/
└─ travel.airport/ travel.hotel/ travel.restaurant/ travel.transport/ travel.emergency/
```

### `manifest.json` (exemplo)
```json
{
  "id": "country.au",
  "title": { "pt-BR": "Austrália", "en": "Australia" },
  "language": "en",
  "variant": "en-AU",
  "levels": ["a1", "a2", "b1", "b2", "c1"],
  "status": "draft_ai",
  "reviewed_at": null,
  "reviewed_by": null
}
```
`status`: `draft_ai` (rascunho gerado por IA — não exibido a usuários) → `reviewed` (revisado por humano) → `published`.

### Exemplo 1 — `profession.software_developer`
| Nível | Cenários (roleplay) | Vocabulário/expressões de amostra |
|---|---|---|
| A1–A2 | Apresentar-se ao time; dizer no que está trabalhando | *bug, fix, test, deploy, I'm working on…* |
| B1 | Daily/standup: ontem, hoje, bloqueios; pedir ajuda num bug | *blocker, merge conflict, I'm stuck on…, could you take a look?* |
| B1–B2 | Descrever um PR; responder comentários de code review com educação | *edge case, refactor, nit, I'd suggest…, good catch* |
| B2 | Entrevista comportamental (método STAR); estimar prazos | *trade-off, scope, tech debt, roll out, figure out* |
| B2–C1 | Explicar uma arquitetura; discordar com tato numa reunião | *I see your point, but…; the main concern is…* |
| C1 | Escrever um *postmortem*; conduzir uma reunião técnica | *root cause, mitigation, action items* |

### Exemplo 2 — `country.au` (Austrália)
| Bloco | Conteúdo | Regras de curadoria |
|---|---|---|
| Sotaque | Variante `en-AU` no TTS quando disponível; atividades de escuta com sotaque australiano | Avisar se a voz en-AU não existir no aparelho |
| Gírias | *arvo* (tarde), *brekkie* (café da manhã), *servo* (posto de gasolina), *mate*, *no worries*, *heaps*, *reckon*, *How ya going?*, *thongs* (chinelos!), *esky* (caixa térmica) | Lista curada; marcar como informal |
| Cultura | Small talk, churrasco (*barbie*), esportes, gorjeta (em geral não esperada), pontualidade, humor | Cada fato com fonte em `facts.json` |
| Segurança | Nadar entre as bandeiras nas praias vigiadas; proteção solar; crocodilos no norte do país; animais selvagens | **Somente** fatos curados com fonte oficial e data de revisão |
| Trabalho | Entrevista em hospitalidade/varejo, turnos, conversa com gerente, direitos básicos (apontar para fontes oficiais) | Sem números/leis no texto da IA |
| Imigração e vistos | **Não** ensinamos regras; só vocabulário para situações (imigração no aeroporto, formulários) e links oficiais do governo australiano | Regra H6 (`../ia/controle-de-alucinacao-do-tutor.md`) |

## Algoritmo de entrelaçamento (como o objetivo entra em toda lição)
1. Cada unidade tem um **ponto do programa** (gramática + funções do nível).
2. O código escolhe o **tema** da lição entre os objetivos ativos, por prioridade (peso = prioridade normalizada), alternando para variar.
3. Proporção padrão: **60% núcleo do nível / 40% camada do objetivo** (ajustável em Configurações: "mais foco no meu objetivo").
4. O `LessonSpec` recebe: ponto gramatical + vocabulário central + vocabulário/cenário do tema + fatos curados (se houver).
5. Exemplo: A2 · passado simples · objetivo dev → *"Tell me what you did yesterday at work"* (daily); objetivo Austrália → *"Your first weekend in Sydney"*.

## Pacote "pronto para a viagem" (OBJ-05)
Com `target_date` definida:
| Faltam | O que a trilha prioriza |
|---|---|
| > 90 dias | Trilha normal com 40% do tema |
| 90–30 dias | Sobe para 60% do tema; cenários de sobrevivência (aeroporto, imigração, transporte, hospedagem) |
| 30–7 dias | Roleplays completos das primeiras 48 h no destino; números, endereços, emergências |
| < 7 dias | Revisão intensiva das frases-chave + "kit de bolso" (lista para consultar offline) |
| Depois da data | Pergunta como foi; troca para "morando/estudando lá" se for mudança |
E-mails de contagem regressiva só com opt-in (`rotina-engajamento-notificacoes-emails.md`).

## Mudança de objetivo
- Adicionar/remover/pausar objetivo a qualquer momento.
- O progresso (nível, vocabulário, lições feitas) **nunca** se perde.
- As próximas unidades são replanejadas; o aluno vê "sua trilha foi ajustada para: …".

## Curadoria de conteúdo cultural (Q-20)
1. A IA pode gerar **rascunhos** (`status: draft_ai`) com fontes sugeridas.
2. Um humano (o dono ou colaborador) confere cada fato na fonte e preenche `reviewed_at`/`reviewed_by`.
3. Só pacotes `reviewed`/`published` aparecem para usuários.
4. Revisão anual dos fatos (datas de revisão visíveis).
