# Metodologia de ensino

## Fundamentos (o "porquê" de cada escolha)
| Princípio | Em uma frase | Como aparece no PapeAI |
|---|---|---|
| **Input compreensível** | Aprendemos com conteúdo que entendemos quase todo, com um pouco de novidade ("i+1") | Fala do tutor ajustada ao nível; leituras e áudios um degrau acima |
| **Produção e interação** | Falar e escrever obriga a perceber lacunas | Conversa e roleplay em toda lição |
| **Perceber (noticing)** | Só corrigimos o que notamos | Destaque exato do trecho errado, comparação lado a lado |
| **Feedback corretivo variado** | Reformular, explicar, pedir autocorreção | Muda conforme nível e modo do professor |
| **Revisão espaçada + recuperação ativa** | Lembrar no momento certo fixa a memória | FSRS para vocabulário e frases; exercícios de lembrar, não de reler |
| **Aprendizagem por tarefas** | Aprender fazendo tarefas reais | Tarefas ligadas ao objetivo: daily de dev, check-in no aeroporto de Sydney |
| **Fluência e precisão** | Ambas importam, em momentos diferentes | Atividades "só fluência" (sem correção na hora) e "foco em precisão" |
| **Motivação** | Autonomia, competência e vínculo | Escolha de objetivos (autonomia), progresso visível (competência), mascote (vínculo) |
| **Inteligibilidade** | Ser entendido > soar nativo | Pronúncia avaliada pelo impacto na compreensão; sotaque não é erro |
| **Dificuldade na medida** | Acertar ~80% mantém desafio sem frustrar | Adaptação automática da dificuldade |

## Referência de níveis: CEFR (QECR)
Pre-A1 → A1 → A2 → B1 → B2 → C1 → C2, com subníveis .1/.2/.3 internos ao app.
O nível do PapeAI é **estimativa** baseada nos descritores do CEFR — não é certificação.

## Equilíbrio de habilidades por nível (% do tempo de prática, ponto de partida)
| Nível | Escuta | Fala | Leitura | Escrita | Vocabulário | Gramática | Pronúncia |
|---|---|---|---|---|---|---|---|
| Pre-A1–A1 | 25 | 15 | 10 | 5 | 25 | 10 | 10 |
| A2 | 20 | 20 | 15 | 10 | 15 | 10 | 10 |
| B1 | 20 | 25 | 15 | 15 | 10 | 10 | 5 |
| B2 | 15 | 30 | 15 | 15 | 10 | 10 | 5 |
| C1–C2 | 15 | 35 | 15 | 20 | 5 | 5 | 5 |
Ajustado pelo objetivo (ex.: viagem dá mais peso a escuta e fala; trabalho remoto, a escrita).

## Estrutura da sessão diária
| Bloco | O que acontece | 5 min | 10 min | 15 min | 20 min | 30 min |
|---|---|---|---|---|---|---|
| 1. Aquecimento | Mascote cumprimenta, retoma algo de ontem | 0,5 | 1 | 1 | 1 | 2 |
| 2. Revisão (SRS) | Cartões vencidos | 2 | 3 | 3 | 4 | 5 |
| 3. Conteúdo novo | Diálogo/áudio/leitura curto no tema do objetivo | 1 | 2 | 4 | 5 | 8 |
| 4. Prática guiada | Exercícios focados no ponto do dia | 1 | 2 | 3 | 4 | 6 |
| 5. Produção | Roleplay/conversa usando o conteúdo novo | — | 1,5 | 3 | 5 | 8 |
| 6. Fechamento | Resumo, 1 coisa para lembrar, XP | 0,5 | 0,5 | 1 | 1 | 1 |

## Ciclos maiores
- **Semanal:** 5 dias de lições + 1 dia de revisão/desafio + 1 dia livre (sem perder sequência).
- **Mensal:** conversa de re-nivelamento + relatório de evolução.
- **Por nível:** "conversa de verificação" para subir de nível (`trilha-e-curriculo.md`).

## Estratégia de correção por nível
| Nível | Estratégia principal | Exemplo |
|---|---|---|
| Pre-A1–A1 | Reformulação gentil + explicação curta em português só para erros que atrapalham | "*I have 25 years* → em inglês usamos *I'm 25 (years old)*" |
| A2–B1 | Pedir autocorreção antes de dar a resposta | "Quase! Olha o verbo em *Yesterday I go…* — consegue corrigir?" |
| B2 | Correções de precisão + naturalidade | "*Make a decision* soa mais natural que *do a decision*" |
| C1–C2 | Registro, nuance, estilo | "Em e-mail para cliente, *I'd appreciate it if…* é mais polido que *Please do…*" |

## Erros típicos de falantes de português brasileiro (catálogo inicial)
> Vira `content/languages/en/l1/pt-BR.json` na F06 e alimenta prompts, exercícios e evals.

### Gramática e vocabulário
| Erro comum | Forma correta | Por quê acontece |
|---|---|---|
| *I have 25 years.* | *I'm 25.* | Tradução de "tenho 25 anos" |
| *Have many people here.* | *There are many people here.* | "Tem" = existir |
| *Is raining.* | *It's raining.* | Português omite o sujeito |
| *People is…* | *People are…* | "Gente é" no singular |
| *The life is hard.* | *Life is hard.* | Artigo antes de substantivo abstrato |
| *I'm agree.* | *I agree.* | "Estou de acordo" |
| *Actually* = atualmente | *currently / nowadays* | Falso cognato |
| *Pretend* = pretender | *intend / plan* | Falso cognato |
| *Push* = puxar | *pull* | Falso amigo de som |
| *Reds cars* | *red cars* | Adjetivo não vai para o plural |
| *Depend of* | *depend on* | Preposição traduzida |
| *Since three years* | *for three years* | "Há três anos" |
| *I live here since 2020.* | *I've lived here since 2020.* | Present perfect x presente |
| *Do a mistake* | *make a mistake* | Make x do |
| *Explain me* | *Explain to me / Explain it to me* | Estrutura do verbo |
| *He don't* | *He doesn't* | Terceira pessoa |

### Pronúncia (sons e padrões)
| Dificuldade | Exemplo | O que o ouvinte pode entender |
|---|---|---|
| /θ/ e /ð/ (*th*) viram /f/, /t/, /d/ ou /s/ | *think* → "fink"/"tink" | Palavra errada (*sink*, *tank*) |
| Vogal extra no fim de consoante | *big* → "bigui", *Facebook* → "Facebuqui" | Sílaba a mais, ritmo quebrado |
| *t/d* antes de /i/ viram "tchi/dji" | *party* → "partchi" | Sotaque forte, às vezes palavra errada |
| *r* inicial pronunciado como /h/ | *rat* → "hat" | Troca de palavra |
| /h/ inicial omitido ou exagerado | *house*, *hello* | Compreensão reduzida |
| Pares de vogais curtas/longas | *ship* x *sheep*, *live* x *leave* | Troca de palavra |
| /æ/ x /ɛ/ | *bad* x *bed* | Troca de palavra |
| *-ed* sempre como sílaba extra | *worked* → "workedi" | Ritmo e tempo verbal confusos |
| *s* inicial com vogal antes | *school* → "eschool" | Sílaba extra |
| *l* final vira /w/ | *hotel* → "hotew" | Leve |
| Tonicidade e redução (schwa) | *photograph* x *photography* | Compreensão em fala rápida |
| Terminação *-ing* com "g" forte ou nasal | *running* | Leve |

## Princípios para desenhar atividades
1. **Um objetivo** por atividade, explícito para o aluno.
2. **Feedback imediato** e específico.
3. **Dificuldade adaptativa** mirando ~80% de acerto.
4. **Variedade** de tipos ao longo da semana.
5. **Ligação com o objetivo** do aluno em toda lição.
6. **Terminar com sucesso:** a última atividade da lição é alcançável.
7. **Acessível:** toda atividade de fala tem alternativa sem fala (VOZ-12).
