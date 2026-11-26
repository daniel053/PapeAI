# 03 — Ideia original e rastreabilidade

> **Objetivo deste documento:** provar que nenhum ponto da sua ideia se perdeu. Cada ponto recebeu um ID (`I-xx` da ideia, `M-xx` da mensagem de abertura), foi ligado a requisitos (`02-REQUISITOS.md`), documentos e fases.
>
> ⚠️ **Antes de tornar o repositório público (F11):** os textos abaixo são transcrições literais e incluem comentários pessoais. Revise e, se quiser, troque por um resumo. A matriz de rastreabilidade continua válida.

## 1. Mensagem de abertura (literal)
```text
Bom, eu estava falando com uma IA e eu peguei tudo que eu falei para ela criar esse one-shot prompt e, na verdade, eu acho que eu já vou mandar isso para você e vou pedir para que você pegue tudo isso que eu conversei com ela e me ajude a estruturar como a gente vai começar tá? Deve cada ponto em consideração, não vamos perder nada. Crie estruturas pensando no vibe coding do início ao final, lembrando de verificações de segurança, como problemas que vamos ter com token, usuários que vão se cadastrar, forma com que a gente vai guardar cada usuário, o usuário tem que ter aqueles padrões da web, como login com conta do Google, que eu acho que é um padrão que a gente pode colocar, e várias outras coisas devem ser levadas em conta. Bom, é isso. Quando eu digo que várias coisas devem ser levadas em conta, eu digo de regras de segurança, como camadas de usuário não expostas, etc. Um site com aquele robots.txt para que os usuários não encontrem, e muita coisa. Aqui eu tenho uma ideia bruta, grande. Muito detalhe e rica do meu ponto de vista. Eu preciso que você capte cada ponto. E também, se você vê que faltou alguma coisa, incremente. E vamos dividir em grandes fases de desenvolvimento, com aprovações, tudo guiado por mim. Feito por você. E é isso. Só lembrando, crie vários documentos de estruturas. Bom, a gente vai dividir o desenvolvimento por fases. Então, eu gostaria que você separasse fases por estruturas, um readme ali para você sempre estar entendendo o que você tem que fazer, esse readme ele faz chamadas de acordo com qual fase do desenvolvimento está, para que você não tenha tudo só no readme, então você vá para outros documentos conforme necessário, esses documentos vão ter desde estrutura de dados, atualização dessas estruturas de dados, parte guiada ali do desenvolvimento, controle de alucinação por IA, etc. E
```

## 2. Ideia original (literal)
```text
Vamos supor que eu Eu tive uma ideia agora de iniciar um projeto pessoal, e esse projeto pessoal se baseia em a gente conduzir uma IA para nos ensinar inglês, como várias outras IAs que já tem por aí. Só que eu gostaria de fazer isso para quem tem assinatura do Cloud Code. A ideia é que você não pague um aplicativo para fazer isso. A ideia é que você tenha um aplicativo, você vai lá, você coloca sua chave de API e pronto, você já está conectado com a IA, você gerencia seus tokens sem ninguém te cobrar por isso. Você usa o seu próprio token e está tudo certo. E aí, pensando nisso, eu gostaria de que você me ajudasse a gerar um prompt, um one-shot prompt. Não um one-shot prompt que vai gerar o aplicativo, mas um one-shot prompt que vai gerar uma uma divisão de fase de desenvolvimento para para todo essa mini escola de inglês guiando esse mini tutor. Porque assim, a gente tem que pensar que eu quero fazer o tutor. O tutor ele tem que ser 3D, né? Convenhamos. Só que ele não vai ser uma pessoa, ele tem que ser um mascote. E hoje em dia as pessoas fazem muitos mascotes com alguns animais específicos e eu acho legal um mascote low poly. Ele é leve, ele é fácil de processar e talvez a gente consiga fazer um esquema que não consuma muitos tokens. Então, mascote 3D low poly com uma textura de 128 x e com animações e bordas mais suaves, arredondadas. A gente consegue criar um mascote legal e esse vai ser o padrão. Ao iniciar o curso a gente tem que falar que a gente é uma plataforma segura, uma plataforma bem bonita de escola com um design padrão. A gente tem que pensar numa logo, a gente tem que pensar em como a gente vai guiar esse aprendizado. A gente tem que pensar em talvez, um exemplo, ser criativo e colocar sobre o professor ele ser mais modesto, o professor ele te falar coisas na cara mesmo, aí ele desliga um pouco o filtro e fala, você foi horrível nisso. Sabe? Porque o pessoal gosta disso, mas tem gente que também não gosta, então vamos dar a possibilidade de quem não gosta se esquivar desse tipo de coisa. E a gente tem que pensar em toda uma trajetória de aprendizado. A gente tem que pensar em talvez em tal, no futuro ali, vamos supor que você evolua, eu coloco uma coisa paga ali para ele ter um a mais, algo que o usuário gosta. E tudo focado para o aprendizado de outras línguas e ali a gente pode focar inicialmente no inglês, né? Mas vamos deixar o código em aberto para outras línguas também. A gente tem que pensar quando o usuário entrar a gente fazer também uma mini provinha que não seja uma prova, para não ser chato, mas um bate-papo com a IA, que a IA vai falar para ele responder apenas na língua e a gente vai medir qual que é o nível dele de inglês. A ideia é que a gente tenha uma trajetória completa até o inglês avançado, onde ele consegue falar tudo em inglês. E que pensando, voltando lá para a parte criativa, o usuário que que fala que quer aprender inglês, por exemplo, para ser um desenvolvedor de software, então ele adicionar temas dedesenvolvimento de software em toda a sua linha de aprendizado ou ele quer apenas viajar para um país, ele quer conhecer um pouco mais sobre a cultura. Uma coisa legal é dizer, ah, ele vai viajar para algum lugar? Qual país que é? Então a gente coloca coisas sobre a cultura do país. E a gente ter toda essa versatilidade ali para a pessoa. E isso sempre disponível para entender que guiamos seu aprendizado para o seu objetivo, não apenas apenas a pronunciar a língua. Vá pronto para o que você quer fazer. Este eu acho que é o objetivo da maioria das pessoas. Um exemplo, um cara que vai para a Austrália, ele vai falar sobre crocodilos, ele vai falar sobre o emprego que ele vai ter lá. Eu sei que eu não conheço muito sobre a Austrália, mas deu para entender. E eu acho que a minha ideia como escola é essa. E que seja algo grátis. A pessoa só vai precisar fornecer a chave de API. Aí entra questões graves, fortes de segurança, tá? Bom, se a pessoa forneceu a chave de API dela, que fique apenas esse vai ser um aplicativo mobile, tá? Que fique apenas no celular. Não pode, isso não pode vazar. Então a pessoa pode ser a chave de API dela, isso fica 100% no celular dela e a gente não vaza isso para mais nenhuma outra plataforma, nós temos que ter cuidado. Tá? E isso tem que estar expresso no código fonte, tá? Porque esse vai ser um projeto que vai estar no meu GitHub e vai ser de código aberto. OK? Bom, eu acho que podemos pensar também no aprendizado guiado, já que a gente vai ter um mascote em 3D, esse mascote em 3D, tudo que ele fala, às vezes a gente pode escolher sobre ter legenda embaixo e não ter. E fica às vezes como um desafio, né, para a pessoa. O falar mais devagar também é uma opção. E a voz, a gente tem que ter opções de voz que talvez para o próprio Claude Code já dê ou outra IA, outra chave de IA, mas hoje eu só tenho o Claude Code, então vamos começar com o Claude Code. Bom, se eu precisar conectar o meu Claude Code a outros serviços de voz, que às vezes está alguma coisa na internet, a necessidade tecnológica disso, precisamos levar em conta, tá? Eu sei que existem as pagas que são apenas para voz, transcrição de voz, cópia de voz e talvez alguma IA nesse sentido enriqueça o projeto. Lembrando que esse é um projeto free, tá? Eu sei que a parte de voz ali do Claude Code não funciona muito bem. Um outro ponto, nós precisamos entender que uma escola de inglês ali quando a pessoa está falando inglês, a gente tem que entender o que está sendo dito palavra por palavra. Às vezes eu acho que você, quando eu peço para você pegar o texto que eu estou falando, você parece que dá uma arredondada para a palavra que parece ser. E isso, eu acho que no aprendizado guiado tem que ser preciso. Preciso no ponto de que? Entender exatamente o que o usuário fala, o que a pessoa que está falando falou, como a entonação da voz e vários outros aspectos devem ser coletados durante a voz. Tá? E precisamos também, eu acho que até no próprio jabá do nosso curso, a gente precisa especificar isso.

Continuando aqui com mais um pouco de jogar ideias aí para o ar ali para a gente planejar esse one-shot prompt, eu pensei na forma de login. E hoje, se eu for fazer esse aplicativo, eu tenho dificuldades ali de fazer com o banco de dados da Google. O Firebase ali é pago e eu não tenho dinheiro nenhum para para iniciar isso, estou passando por alguns apertos. Então, eu gostaria de tentar talvez uma forma mais barata possível. Já ouvi falar do Supabase, mas nunca usei. Eu não sei se ele funciona para mobile, não sei se eu consigo gerar ali o APK com facilidade e fazer testes. Eu gostaria de começar numa estrutura simples e fácil de aprender o mobile, talvez até um site. Se a gente conseguir fazer isso dentro de um site e colocar para rodar lá no Supabase totalmente grátis, isso para mim é algo 100% positivo, porque depois a gente só pega a aplicação e migra para outro tipo de plataforma, trazendo as funcionalidades que já foram desenvolvidas com os módulos. Bom, eu comentei há um tempo atrás ali sobre a forma com que a gente vai coletar as palavras que são ditas ali. Bom, a gente precisa ser preciso nisso, esse é um ponto muito importante. Conforme a pessoa vai falando, a gente precisa entender o que está sendo dito e eu acho que aí entra um pouco de talvez um pouco de matemática e modelos ou talvez uma descrição mais objetiva para modelos que vão estar lendo isso. A gente precisa, talvez esse one-shot prompt não saia, talvez você me retorne algumas perguntas. E só frisando aqui que esse objetivo deste one-shot prompt é a gente criar os recursos e as regras. Crie um documento extenso aí, talvez vai passar de 5.000 linhas. Eu entendo que quando você começar a detalhar as regras, toda a trajetória do aluno, porque leva-se anos para aprender inglês, meses, então tem que ter um trabalho diário, um acompanhamento, umas notificações, tem que ter muita coisa e eu gostaria que nada dessas informações fossem perdidas. Envio de e-mails também é importante.
```

## 3. Interpretações feitas (confirme se estiverem erradas)
| Trecho original | Interpretação | Por quê |
|---|---|---|
| "assinatura do Cloud Code" / "coloca sua chave de API" | Chave de API da Claude Console (não o login da assinatura). | Regras da Anthropic proíbem login de assinatura em apps de terceiros. Ver `01-VISAO-DO-PRODUTO.md`. |
| "professor ele ser mais modesto" | Provavelmente "mais **honesto**" (transcrição de voz trocou a palavra). | O resto da frase fala em "falar coisas na cara". Ver Q-24. Ironia: é exatamente o problema de "arredondar palavras" que o app quer resolver. |
| "textura de 128 x" | Textura **128×128** pixels. | Padrão de texturas quadradas em potência de 2. |
| "robots.txt para que os usuários não encontrem" | Para que **buscadores** não indexem as páginas internas do app. | robots.txt orienta robôs de busca; **não** é proteção (ver `seguranca/seguranca-web-headers-csp-robots.md`). |
| "problemas que vamos ter com token" | Os **dois** sentidos: tokens de IA (custo/consumo) e tokens de autenticação (sessão/JWT). | Ambos são riscos reais; cobertos em `ia/economia-de-tokens-e-custos.md` e `seguranca/autenticacao-e-sessoes.md`. |
| "colocar para rodar lá no Supabase totalmente grátis" | Supabase para banco/login/funções; o site é hospedado em outro serviço gratuito. | O Supabase não hospeda o frontend do site. Ver ADR-0002 e ADR-0004. |
| "O Firebase ali é pago" | Preferência por evitar custo e dependência. | O Firebase tem plano gratuito, mas o Supabase se encaixa melhor (SQL, RLS, código aberto). Ver ADR-0002. |
| "vozes que talvez o próprio Claude Code já dê" | O Claude (API) não fornece voz; usamos voz do aparelho e provedores opcionais. | A API de mensagens do Claude trabalha com texto/imagens/documentos. Ver `voz/provedores-de-voz.md`. |
| "one-shot prompt" | Virou um **conjunto de documentos** com roteador (`CLAUDE.md`) em vez de um prompt único. | Pedido explícito da mensagem de abertura (M-09, M-10). |

## 4. Matriz de rastreabilidade — ideia original
| ID | Ponto da ideia | Requisitos | Documentos | Fase |
|---|---|---|---|---|
| I-01 | IA conduzindo o ensino de inglês | TUT-01 | `ia/arquitetura-do-tutor.md` | F04 |
| I-02 | Sem pagar app; usuário põe a própria chave e gerencia os próprios tokens | PRD-01, PRD-02, BYOK-01, BYOK-11 | `seguranca/cofre-da-chave-api.md`, `ia/economia-de-tokens-e-custos.md` | F03 |
| I-03 | Divisão em fases para toda a mini escola | DEV-01 | `fases/` | todas |
| I-04 | Tutor 3D | MAS-01 | `design/mascote-3d.md` | F08 |
| I-05 | Mascote, não pessoa | MAS-01, TUT-14 | `design/mascote-3d.md` | F08 |
| I-06 | Animal; estilo low poly | MAS-01 | `design/mascote-3d.md` | F00 (escolha) / F08 |
| I-07 | Leve, fácil de processar, poucos tokens | MAS-05, MAS-06, TUT-08, TUT-11, TRI-06 | `design/mascote-3d.md`, `ia/economia-de-tokens-e-custos.md` | F04/F08 |
| I-08 | Textura 128×128, animações, bordas suaves arredondadas | MAS-02, MAS-03 | `design/mascote-3d.md` | F08 |
| I-09 | Comunicar que é plataforma segura | PRD-06, BYOK-01 | `design/ux-telas-e-acessibilidade.md`, `design/identidade-visual-e-marca.md` | F03/F05 |
| I-10 | Plataforma bonita de escola, design padrão | PRD-07 | `design/identidade-visual-e-marca.md` | F01 |
| I-11 | Logo | PRD-08 | `design/identidade-visual-e-marca.md` | F00/F01 |
| I-12 | Como guiar o aprendizado | TRI-02, TRI-05 | `pedagogia/metodologia.md`, `pedagogia/trilha-e-curriculo.md` | F06 |
| I-13 | Professor mais honesto, que fala na cara | TUT-03 | `ia/personalidade-e-modos-de-feedback.md` | F04 |
| I-14 | "Você foi horrível nisso" — mas quem não gosta pode evitar | TUT-03, TUT-04, ENG-08 | `ia/personalidade-e-modos-de-feedback.md` | F04 |
| I-15 | Trajetória completa de aprendizado | TRI-01, TRI-07 | `pedagogia/trilha-e-curriculo.md` | F06 |
| I-16 | Futuro: algo pago "a mais" que o usuário goste | PRD-09 | `fases/F12-evolucao-premium-e-idiomas.md` | F12 |
| I-17 | Outras línguas; inglês primeiro; código aberto a outras | PRD-05 | `pedagogia/idiomas-extensiveis.md` | F06/F12 |
| I-18 | Mini prova que não é prova: bate-papo, responder só no idioma, medir nível | NIV-01..NIV-06 | `pedagogia/nivelamento-conversa.md` | F05 |
| I-19 | Trajetória até o avançado ("falar tudo em inglês") | TRI-01, NIV-07 | `pedagogia/trilha-e-curriculo.md` | F06 |
| I-20 | Objetivo dev → temas de software em toda a trilha | OBJ-01, OBJ-04 | `pedagogia/personalizacao-por-objetivo.md` | F05/F06 |
| I-21 | Viagem/cultura → qual país? → cultura do país | OBJ-01, OBJ-02, OBJ-04, TUT-13 | `pedagogia/personalizacao-por-objetivo.md` | F05/F06 |
| I-22 | Versatilidade sempre disponível; "Vá pronto para o que você quer fazer" | OBJ-03, OBJ-07 | `pedagogia/personalizacao-por-objetivo.md`, `design/identidade-visual-e-marca.md` | F05/F11 |
| I-23 | Exemplo Austrália: crocodilos, emprego | OBJ-02, OBJ-04, TUT-13 | `pedagogia/personalizacao-por-objetivo.md` | F06 |
| I-24 | Grátis; só precisa da chave | PRD-01 | `01-VISAO-DO-PRODUTO.md` | F03 |
| I-25 | Segurança forte: chave só no celular, não pode vazar | BYOK-04..BYOK-10, SEG-16 | `seguranca/cofre-da-chave-api.md` | F03/F10 |
| I-26 | Isso expresso no código-fonte aberto no GitHub | BYOK-15, BYOK-16, PRD-04, SEG-13 | `seguranca/cofre-da-chave-api.md`, `processo/testes-e-qualidade.md` | F03 |
| I-27 | Legenda embaixo opcional; como desafio | VOZ-01, VOZ-02 | `voz/pipeline-de-fala.md` | F07 |
| I-28 | Falar mais devagar | VOZ-03 | `voz/pipeline-de-fala.md` | F07 |
| I-29 | Opções de voz; Claude ou outra IA/chave; serviços de voz na internet; free | VOZ-04, VOZ-10, PRD-10 | `voz/provedores-de-voz.md`, ADR-0007 | F07 |
| I-30 | Entender palavra por palavra, sem arredondar | VOZ-05, VOZ-08, TUT-12 | `voz/pipeline-de-fala.md` | F07 |
| I-31 | Coletar entonação e outros aspectos da voz | VOZ-06, VOZ-07 | `voz/precisao-matematica-e-metricas.md` | F07 |
| I-32 | Destacar a precisão no "jabá" | VOZ-08, OBJ-07 | `design/identidade-visual-e-marca.md` | F11 |
| I-33 | Login barato; Firebase visto como pago; sem dinheiro | RNF-01, CON-01, CON-02 | ADR-0002, `arquitetura/custos-e-limites.md` | F00/F02 |
| I-34 | Supabase funciona para mobile? APK fácil? testes? | PRD-03 | ADR-0001, ADR-0002, `fases/F10-app-android.md` | F10 |
| I-35 | Começar simples (site), depois migrar mantendo os módulos | PRD-03, RNF-10 | ADR-0001, `arquitetura/estrutura-de-pastas-e-modulos.md` | F01/F10 |
| I-36 | Precisão da fala: matemática e modelos, descrição objetiva | VOZ-06, VOZ-11 | `voz/precisao-matematica-e-metricas.md` | F07 |
| I-37 | Talvez retornar perguntas | — | `04-PERGUNTAS-EM-ABERTO.md` | F00 |
| I-38 | Criar recursos e regras; documento extenso | DEV-02, DEV-03 | toda a pasta `docs/` | F00 |
| I-39 | Anos/meses de estudo: trabalho diário, acompanhamento, notificações | TRI-03, TRI-12, ENG-01, ENG-07 | `pedagogia/rotina-engajamento-notificacoes-emails.md` | F06/F09 |
| I-40 | Nada pode ser perdido | DEV-02 | este documento | F00 |
| I-41 | Envio de e-mails é importante | ENG-03..ENG-06 | `pedagogia/rotina-engajamento-notificacoes-emails.md` | F09 |

## 5. Matriz de rastreabilidade — mensagem de abertura
| ID | Ponto | Requisitos | Documentos | Fase |
|---|---|---|---|---|
| M-01 | Estruturar como começar, considerando cada ponto | DEV-01 | `fases/F00-fundacao-e-decisoes.md` | F00 |
| M-02 | Vibe coding do início ao fim | DEV-01..DEV-08 | `processo/fluxo-de-trabalho-vibe-coding.md` | todas |
| M-03 | Verificações de segurança: tokens, cadastro, como guardar cada usuário | CON-*, SEG-01, SEG-12, PRIV-02 | `seguranca/autenticacao-e-sessoes.md`, `dados/modelo-de-dados.md` | F02 |
| M-04 | Padrões da web, como login com Google | CON-01, CON-02 | `seguranca/autenticacao-e-sessoes.md`, ADR-0006 | F02 |
| M-05 | Camadas de usuário não expostas | SEG-11, CON-10, TUT-15 | `seguranca/supabase-rls-e-backend.md` | F02 |
| M-06 | robots.txt para não encontrarem páginas internas | SEG-04 | `seguranca/seguranca-web-headers-csp-robots.md` | F01 |
| M-07 | Captar cada ponto e incrementar o que faltar | — | este documento (seção 6) | F00 |
| M-08 | Grandes fases com aprovações, guiadas pelo dono, feitas pela IA | DEV-01 | `processo/portoes-de-aprovacao.md` | todas |
| M-09 | Vários documentos de estrutura | DEV-04 | `docs/` | F00 |
| M-10 | README que roteia por fase, sem ter tudo nele | DEV-02 | `CLAUDE.md`, `00-ESTADO-ATUAL.md` | F00 |
| M-11 | Docs de estrutura de dados, atualização de dados, desenvolvimento guiado, controle de alucinação | DEV-03, DEV-05 | `dados/`, `processo/controle-de-alucinacao-no-desenvolvimento.md`, `ia/controle-de-alucinacao-do-tutor.md` | F00+ |

## 6. Itens acrescentados pela IA (o que faltava)
| ID | Acréscimo | Por que importa | Onde |
|---|---|---|---|
| A-01 | Assinatura ≠ chave de API; créditos de API em planos Max/Ultra/Team | Muda o público e o onboarding | `01-VISAO-DO-PRODUTO.md` |
| A-02 | Idade mínima 18 | Console da Anthropic exige maioridade do titular da chave; LGPD para menores é mais complexa | ADR-0010 |
| A-03 | LGPD completa (bases legais, direitos, consentimentos, retenção, região) | Obrigação legal no Brasil | `seguranca/privacidade-lgpd.md` |
| A-04 | Exclusão de conta no app e na web | Exigência da Google Play e da App Store | F02, F10 |
| A-05 | MFA nas contas de desenvolvedor | Invadir sua conta do GitHub/Supabase é o atalho mais fácil para um atacante | F00 |
| A-06 | Cadeia de suprimentos e "slopsquatting" (pacotes com nomes inventados por IA) | Risco real em vibe coding | `processo/controle-de-alucinacao-no-desenvolvimento.md` |
| A-07 | CSP como garantia técnica de que a chave só vai à Anthropic | Transforma promessa em regra imposta pelo navegador | `seguranca/seguranca-web-headers-csp-robots.md` |
| A-08 | Origens separadas para site e app | Script do site nunca enxerga o cofre do app | ADR-0004 |
| A-09 | Acessibilidade (WCAG 2.2 AA), movimento reduzido, alternativa sem fala | Inclusão e exigência de qualidade | `design/ux-telas-e-acessibilidade.md` |
| A-10 | Rede ruim e modo offline parcial | Celular no ônibus/metrô | `dados/armazenamento-local.md` |
| A-11 | Limites de gasto no app e na Console | Evita susto na fatura do usuário | `ia/economia-de-tokens-e-custos.md` |
| A-12 | Validação gratuita da chave e "botão de pânico" | Segurança e confiança | `seguranca/cofre-da-chave-api.md` |
| A-13 | "O que o tutor sabe sobre você" (memória editável) | Transparência e controle | `ia/arquitetura-do-tutor.md` |
| A-14 | Licenças de listas de vocabulário e dicionários fonéticos | Evitar violar direitos autorais | ADR-0009 |
| A-15 | Engajamento ético (sem dark patterns) | Confiança de longo prazo | `pedagogia/rotina-engajamento-notificacoes-emails.md` |
| A-16 | Proteção da marca e do mascote, separada da licença do código | Código aberto sem perder a identidade | ADR-0005 |
| A-17 | Custos inevitáveis (domínio, Play Store) e regra dos 12 testadores | Planejamento realista | `arquitetura/custos-e-limites.md` |
| A-18 | Verificação de desenvolvedor Android (em vigor no Brasil) | Afeta distribuição de APK | F10 |
| A-19 | Observabilidade sem dados pessoais; sem analytics de terceiros | Privacidade e CSP limpa | `seguranca/privacidade-lgpd.md` |
| A-20 | Backups e resposta a incidentes | Saber o que fazer antes de precisar | `seguranca/resposta-a-incidentes.md` |
| A-21 | Interface para múltiplos provedores de IA | Ampliar público no futuro | ADR-0008, backlog |
| A-22 | Chave por aparelho (multi-dispositivo) | Consequência direta da regra "só no celular" | `seguranca/cofre-da-chave-api.md` |
| A-23 | Objetivo "exame" (IELTS/TOEFL) como prática | Objetivo comum | backlog |
| A-24 | Sotaque conforme o destino (en-AU, en-GB...) | Coerência com o objetivo de viagem | `pedagogia/personalizacao-por-objetivo.md` |
| A-25 | Contagem regressiva da viagem | Personalização forte e motivadora | `pedagogia/personalizacao-por-objetivo.md` |
| A-26 | Imersão progressiva no idioma das explicações | Pedagogia | `pedagogia/metodologia.md` |
| A-27 | Reportar correção errada | Controle de alucinação com o usuário | `ia/controle-de-alucinacao-do-tutor.md` |
| A-28 | Iterar prompts no Claude Code (assinatura) antes de gastar API | Economia no desenvolvimento | `ia/avaliacoes-de-prompts-evals.md` |
| A-29 | Ambiente Windows e o problema do OneDrive | Seu repositório está dentro do OneDrive | `processo/ambiente-de-desenvolvimento-windows.md` |
| A-30 | Internacionalização da interface | Coerência com "outras línguas" | `pedagogia/idiomas-extensiveis.md` |
| A-31 | Aviso de certificado não oficial | Evitar propaganda enganosa | `pedagogia/trilha-e-curriculo.md` |
| A-32 | Privacidade do microfone; áudio local | Voz é dado pessoal | `voz/pipeline-de-fala.md` |
| A-33 | Evals de prompts | Qualidade mensurável | `ia/avaliacoes-de-prompts-evals.md` |
| A-34 | Checar nome: domínio, INPI, lojas | Evitar trocar de nome depois | `design/identidade-visual-e-marca.md` |
| A-35 | Limites do modo sem filtro (políticas de uso) | Humor sem virar abuso | `ia/personalidade-e-modos-de-feedback.md` |
| A-36 | Política de novas tentativas para não multiplicar custo | Erros 429/529 podem custar caro | `ia/economia-de-tokens-e-custos.md` |
| A-37 | security.txt e SECURITY.md | Canal para pesquisadores reportarem falhas | `seguranca/seguranca-web-headers-csp-robots.md` |
| A-38 | Matriz de dispositivos e navegadores | Qualidade real | `processo/testes-e-qualidade.md` |
| A-39 | Retenção de dados por tipo | Minimização (LGPD) | `seguranca/privacidade-lgpd.md` |
| A-40 | Configuração sem serviços de terceiros (feature flags no repositório) | Menos superfície de ataque | `arquitetura/stack-tecnologica.md` |
| A-41 | Nota sobre ECA Digital/menores | Contexto legal brasileiro | ADR-0010 |
