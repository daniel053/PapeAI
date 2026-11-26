# Índice da documentação

**Regra de leitura:** a IA não lê tudo de uma vez. Ordem: `00-ESTADO-ATUAL.md` → documento da fase atual (`fases/`) → documentos listados na seção "Documentos desta fase". Isso economiza contexto e evita misturar assuntos.

## Raiz de `docs/`
| Documento | Para quê |
|---|---|
| [00-ESTADO-ATUAL.md](00-ESTADO-ATUAL.md) | Arquivo vivo: fase atual, próximo passo, portões, riscos, histórico de sessões. |
| [01-VISAO-DO-PRODUTO.md](01-VISAO-DO-PRODUTO.md) | Visão, pilares, personas, jornada, não-objetivos, assinatura x chave de API. |
| [02-REQUISITOS.md](02-REQUISITOS.md) | Catálogo de requisitos com IDs (ex.: `BYOK-05`), prioridade e fase. |
| [03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md](03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md) | Texto original do dono + matriz "cada ponto → requisito → fase". Prova de que nada se perdeu. |
| [04-PERGUNTAS-EM-ABERTO.md](04-PERGUNTAS-EM-ABERTO.md) | Decisões que dependem do dono, com recomendação. |
| [05-GLOSSARIO.md](05-GLOSSARIO.md) | Termos técnicos explicados em linguagem simples. |
| [06-BACKLOG-DE-IDEIAS.md](06-BACKLOG-DE-IDEIAS.md) | Ideias estacionadas (não desviam a fase atual). |

## `processo/` — como trabalhamos
| Documento | Para quê |
|---|---|
| [fluxo-de-trabalho-vibe-coding.md](processo/fluxo-de-trabalho-vibe-coding.md) | Ciclo de sessão, tamanho das tarefas, frases de comando, uso do Claude Code. |
| [portoes-de-aprovacao.md](processo/portoes-de-aprovacao.md) | Como cada fase é aprovada; modelo de relatório do portão. |
| [definicao-de-pronto.md](processo/definicao-de-pronto.md) | Critérios de "pronto" para tarefa e para fase. |
| [controle-de-alucinacao-no-desenvolvimento.md](processo/controle-de-alucinacao-no-desenvolvimento.md) | Regras para a IA não inventar APIs, pacotes, limites ou resultados. |
| [git-github-e-ci.md](processo/git-github-e-ci.md) | Branches, commits, PRs, CI e configurações de segurança do GitHub. |
| [testes-e-qualidade.md](processo/testes-e-qualidade.md) | Estratégia de testes, testes críticos de segurança, matriz de dispositivos. |
| [ambiente-de-desenvolvimento-windows.md](processo/ambiente-de-desenvolvimento-windows.md) | O que instalar no Windows e armadilhas (OneDrive!). |

## `arquitetura/`
| Documento | Para quê |
|---|---|
| [visao-geral.md](arquitetura/visao-geral.md) | Componentes, fronteiras de confiança, fluxos de dados (diagramas). |
| [stack-tecnologica.md](arquitetura/stack-tecnologica.md) | Tecnologias escolhidas, alternativas e política para novas dependências. |
| [estrutura-de-pastas-e-modulos.md](arquitetura/estrutura-de-pastas-e-modulos.md) | Pastas do monorepo e regras de import entre módulos. |
| [custos-e-limites.md](arquitetura/custos-e-limites.md) | Planos gratuitos, limites a monitorar e custos inevitáveis. |

## `dados/`
| Documento | Para quê |
|---|---|
| [modelo-de-dados.md](dados/modelo-de-dados.md) | Tabelas, colunas, políticas RLS, o que fica no servidor. |
| [armazenamento-local.md](dados/armazenamento-local.md) | O que fica no aparelho (cofre, conversas, áudio, uso de tokens). |
| [evolucao-e-migracoes.md](dados/evolucao-e-migracoes.md) | Como mudar o schema com segurança. |
| [changelog-do-schema.md](dados/changelog-do-schema.md) | Histórico de cada mudança de schema. |

## `seguranca/`
| Documento | Para quê |
|---|---|
| [principios-e-modelo-de-ameacas.md](seguranca/principios-e-modelo-de-ameacas.md) | Ativos, ameaças, mitigações, princípios. |
| [cofre-da-chave-api.md](seguranca/cofre-da-chave-api.md) | Especificação do cofre BYOK (web e nativo). |
| [autenticacao-e-sessoes.md](seguranca/autenticacao-e-sessoes.md) | Login Google, e-mail e senha, tokens de sessão (JWT). |
| [seguranca-web-headers-csp-robots.md](seguranca/seguranca-web-headers-csp-robots.md) | Cabeçalhos, CSP, robots.txt, security.txt, XSS. |
| [supabase-rls-e-backend.md](seguranca/supabase-rls-e-backend.md) | RLS, grants por coluna, schema privado, Edge Functions. |
| [privacidade-lgpd.md](seguranca/privacidade-lgpd.md) | LGPD: inventário de dados, bases legais, direitos, retenção. |
| [checklist-de-seguranca-por-fase.md](seguranca/checklist-de-seguranca-por-fase.md) | O que verificar em cada portão. |
| [resposta-a-incidentes.md](seguranca/resposta-a-incidentes.md) | O que fazer se algo vazar ou quebrar. |

## `ia/`
| Documento | Para quê |
|---|---|
| [arquitetura-do-tutor.md](ia/arquitetura-do-tutor.md) | Rotas de chamada, camadas do prompt, schemas, validação, erros. |
| [personalidade-e-modos-de-feedback.md](ia/personalidade-e-modos-de-feedback.md) | Persona do mascote, modos gentil/equilibrado/sem filtro. |
| [controle-de-alucinacao-do-tutor.md](ia/controle-de-alucinacao-do-tutor.md) | Como impedir o tutor de inventar correções, fatos ou "ouvir" o que não mediu. |
| [economia-de-tokens-e-custos.md](ia/economia-de-tokens-e-custos.md) | Preços, estimativas, cache, limites de gasto. |
| [avaliacoes-de-prompts-evals.md](ia/avaliacoes-de-prompts-evals.md) | Testes de qualidade dos prompts antes de mudanças. |

## `pedagogia/`
| Documento | Para quê |
|---|---|
| [metodologia.md](pedagogia/metodologia.md) | Abordagem de ensino, CEFR, sessão diária, erros típicos de brasileiros. |
| [nivelamento-conversa.md](pedagogia/nivelamento-conversa.md) | O bate-papo de nivelamento e o algoritmo de estimativa. |
| [trilha-e-curriculo.md](pedagogia/trilha-e-curriculo.md) | Trilha Pre-A1 → C2, unidades, atividades, gamificação. |
| [personalizacao-por-objetivo.md](pedagogia/personalizacao-por-objetivo.md) | Objetivos, pacotes temáticos (dev, Austrália...), entrelaçamento. |
| [rotina-engajamento-notificacoes-emails.md](pedagogia/rotina-engajamento-notificacoes-emails.md) | Rotina diária, lembretes, catálogo de e-mails. |
| [idiomas-extensiveis.md](pedagogia/idiomas-extensiveis.md) | Pacotes de idioma e como adicionar novos. |

## `voz/`
| Documento | Para quê |
|---|---|
| [pipeline-de-fala.md](voz/pipeline-de-fala.md) | Captura → reconhecimento literal → pronúncia → prosódia → feedback. |
| [precisao-matematica-e-metricas.md](voz/precisao-matematica-e-metricas.md) | Fórmulas: WER, GOP, YIN, DTW, ritmo, pausas; calibração. |
| [provedores-de-voz.md](voz/provedores-de-voz.md) | Opções de TTS/STT (local e BYOK), custos, privacidade. |

## `design/`
| Documento | Para quê |
|---|---|
| [identidade-visual-e-marca.md](design/identidade-visual-e-marca.md) | Nome, logo, cores, tipografia, tom de voz, mensagens honestas. |
| [mascote-3d.md](design/mascote-3d.md) | Especificação do mascote: estilo, orçamento, animações, pipeline. |
| [ux-telas-e-acessibilidade.md](design/ux-telas-e-acessibilidade.md) | Mapa de telas, fluxos, acessibilidade. |

## `fases/` e `decisoes/`
- [fases/README.md](fases/README.md) — mapa das fases, dependências, marcos.
- [decisoes/README.md](decisoes/README.md) — índice das ADRs e modelo.
