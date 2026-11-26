# Trilha de aprendizado e currículo

## Visão geral: de Pre-A1 a C2
| Nível | Ao final, você consegue… | Horas de estudo guiado (referência Cambridge, cumulativas, aproximadas) |
|---|---|---|
| Pre-A1 | Cumprimentar, dizer nome, números, palavras do dia a dia | — |
| A1 | Apresentar-se, falar da rotina, pedir coisas simples | — (não informado na referência) |
| A2 | Contar o que fez, fazer compras, pedir direções, conversas curtas | ~180–200 h |
| B1 | Viajar com autonomia, contar experiências, dar opiniões simples, lidar com imprevistos | ~350–400 h |
| B2 | Participar de reuniões, argumentar, entender séries sem legenda na maior parte | ~500–600 h |
| C1 | Trabalhar e estudar em inglês com fluência e precisão, ajustar o tom | ~700–800 h |
| C2 | Usar o idioma com nuance quase nativa em qualquer contexto | ~1.000–1.200 h |

> **Honestidade sobre o tempo:** 15 min/dia durante um ano ≈ 90 horas. O app é parte do caminho; exposição extra (séries, música, conversas reais) acelera muito. A mensagem é **constância**, não promessa de fluência em semanas.

## Estrutura
```text
Nível (ex.: A2)
└─ Módulo (4–6 por nível; ex.: "Contar experiências")
   └─ Unidade (1–2 semanas; 5–8 lições; ex.: "Meu fim de semana")
      └─ Lição (5–30 min, conforme a meta diária)
         └─ Atividade (3–6 por lição)
```

### Modelo de unidade
| Componente | Conteúdo |
|---|---|
| Objetivos (can-do) | 2–3 frases "Consigo…" |
| Gramática | 1–2 pontos do programa do nível |
| Vocabulário central | 10–20 itens do nível (listas abertas, ver ADR-0009) |
| Funções/situações | Ex.: pedir desculpas, marcar um horário |
| Camada do objetivo | Vocabulário + cenário do pacote temático do aluno (dev, Austrália...) |
| Revisão | Itens SRS das unidades anteriores |
| Mini-desafio | Roleplay final sem legendas (desafio opcional) |

## Programa por nível (esqueleto — detalhado em `content/languages/en/syllabus.json` na F06)
| Nível | Gramática e estruturas | Funções |
|---|---|---|
| Pre-A1/A1 | *to be*; pronomes; possessivos; presente simples; *there is/are*; *can*; artigos; plurais; imperativo; preposições básicas de lugar e tempo; *wh-questions*; contáveis/incontáveis básicos | Apresentar-se, números, horas, datas, pedir comida, perguntar preço |
| A2 | Passado simples (regular/irregular); presente contínuo; *going to*/*will* básicos; comparativos e superlativos; advérbios de frequência; *much/many/some/any*; *have to/must*; introdução ao *present perfect* (*ever/never*); primeira condicional introdutória | Contar o fim de semana, descrever lugares, fazer planos, pedir direções |
| B1 | *Present perfect* x passado simples; passado contínuo; *used to*; formas de futuro; 1ª e 2ª condicionais; voz passiva (presente/passado); orações relativas definidoras; introdução ao discurso indireto; *phrasal verbs* comuns; gerúndio x infinitivo | Contar experiências, dar e justificar opiniões, resolver problemas em viagem |
| B2 | 3ª condicional e mistas; *past perfect* (contínuo); passiva em todos os tempos; discurso indireto completo; modais de dedução no passado; *wish/if only*; orações não definidoras; marcadores de discurso; colocações | Argumentar, negociar, apresentar ideias em reunião |
| C1 | Inversão; *cleft sentences*; orações reduzidas; *hedging*; registro e formalidade; expressões idiomáticas; elipse e substituição | Escrever e falar com precisão e tom ajustado |
| C2 | Escolhas estilísticas; idiomaticidade; organização do discurso; recursos retóricos | Nuance, ironia, adaptação total ao público |

## Catálogo de atividades
| Tipo | Habilidades | Usa IA? | Correção | Precisa de voz? | Fase |
|---|---|---|---|---|---|
| Cartões SRS (palavra ↔ significado, frase) | Vocabulário | Não | Código (FSRS) | Não | F06 |
| Múltipla escolha | Gramática/vocabulário | Gera (validada) | Código | Não | F06 |
| Lacunas | Gramática/vocabulário | Gera (validada) | Código (+ variações aceitas) | Não | F06 |
| Ordenar frase | Gramática | Gera | Código | Não | F06 |
| Tradução pt → en | Produção | Gera; corrige | IA (`writing.correct`) com citação | Não | F06 |
| Leitura com perguntas | Leitura | Gera | Código | Não | F06 |
| Escrita guiada (e-mail, mensagem) | Escrita | Corrige | IA com citação | Não | F06 |
| Roleplay por cenário | Fala/interação | Sim | IA + checklist de objetivos | Opcional | F04/F06 |
| Ditado | Escuta/ortografia | Não | Código (distância de edição) | TTS | F07 |
| Compreensão auditiva | Escuta | Gera | Código | TTS | F07 |
| Sombra (*shadowing*: repetir após o tutor) | Pronúncia/prosódia | Não | Código (pronúncia/prosódia) | Sim | F07 |
| Leitura em voz alta | Pronúncia | Não | Código (fonemas) | Sim | F07 |
| Pares mínimos (*ship/sheep*) | Pronúncia/escuta | Não | Código | Sim | F07 |
| Desafio sem legendas | Escuta | Não | Código | TTS | F07 |
| Caça ao erro | Gramática | Gera (validada) | Código | Não | F06 |
| Mini-debate (B2+) | Fala/argumentação | Sim | IA com rubrica | Opcional | F06 |

## Geração de lições (rota `lesson.generate`)
**Entrada (`LessonSpec`, montada pelo código):** nível, objetivos da unidade, ponto gramatical, vocabulário-alvo, tema do objetivo, tipos de atividade, duração, variante (en-US/en-AU), erros recorrentes do aluno (memória).
**Saída (`LessonContent`):** lista de atividades no schema de cada tipo.
**Validador (código, antes de exibir):**
- Toda questão tem gabarito, e o gabarito está entre as opções (uma única correta).
- Vocabulário-alvo aparece de fato nas atividades.
- Tamanho de textos compatível com o nível (limites de palavras por nível).
- Sem conteúdo proibido (lista) e sem afirmações factuais sensíveis fora dos fatos curados.
- Falhou → 1 nova geração; falhou de novo → lição de reserva curada (`content/languages/en/fallback-lessons/`).
**Cache:** a lição validada fica no `lesson_cache` local (reaproveitada se o aluno refizer).

## Adaptação
| Sinal | Reação |
|---|---|
| Acerto < 60% em 2 lições seguidas | Lição de reforço do mesmo ponto |
| Acerto > 95% em 3 lições seguidas | Oferece "testar e pular" a unidade |
| Erro recorrente na memória do tutor | Entra como foco nas próximas lições |
| Objetivo mudou | Replaneja as próximas unidades, mantendo o progresso |
| Data de viagem próxima | Ativa o pacote "pronto para a viagem" (`personalizacao-por-objetivo.md`) |

## Progresso e subida de nível (calibrar na F06)
Para subir de nível:
1. ≥ 80% das unidades do nível concluídas;
2. retenção SRS ≥ 85% no vocabulário do nível;
3. **conversa de verificação** (nivelamento curto mirando o próximo nível) com confiança ≥ 0,60.
Ao subir: celebração do mascote, registro em `learning_profiles` (`level_source = progress`) e no histórico.

## Gamificação ética
| Elemento | Regra |
|---|---|
| XP | Por esforço e acerto; nunca por gastar tokens |
| Meta diária | Anel de progresso; escolhida pelo aluno |
| Sequência (streak) | Conta dias com meta cumprida; **proteção** ganha a cada 7 dias (máx. 2); **modo férias** pausa a contagem |
| Conquistas | Primeira conversa, 100 palavras, 7 dias, primeiro nível, "sobrevivi ao modo sem filtro" |
| Proibido | Culpa ("o mascote está triste com você"), contagens regressivas falsas, ranking público no início |

## Acompanhamento de longo prazo (TRI-12)
- Linha do tempo de nível (cada mudança com data e origem).
- Gráficos mensais: minutos, palavras retidas, evolução por habilidade.
- "Retrato do mês": 3 coisas que melhoraram, 1 foco.
- Exportável junto com "Meus dados".

## Certificado
Futuro (F12): "Certificado PapeAI de progresso" — sempre com o aviso **"não é certificação oficial"** (TRI-11).
