# 02 — Catálogo de requisitos

Cada requisito tem um **ID estável** (use-o em commits, testes e conversas: "implementar BYOK-05").
**Prioridade:** `MVP` (necessário para o marco M2/M4) · `V1` (logo após) · `Futuro`.
**Origem:** `I-xx` / `M-xx` = pontos da sua ideia original; `A-xx` = itens que a IA acrescentou (ver `03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md`).

## PRD — Produto
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| PRD-01 | O núcleo do app é gratuito; nenhum pagamento ao projeto para estudar. | MVP | F00/F11 | I-02, I-24 |
| PRD-02 | O usuário usa a própria chave de API (BYOK). | MVP | F03 | I-02 |
| PRD-03 | Começar como web (PWA) e levar o mesmo código para Android/iOS sem reescrever. | MVP | F01/F10 | I-35 |
| PRD-04 | Código aberto no GitHub. | MVP | F00/F11 | I-26 |
| PRD-05 | Inglês primeiro; código aberto a outros idiomas (nada de "inglês" fixo no código). | MVP | F01+ | I-17 |
| PRD-06 | Ao iniciar, comunicar claramente que a plataforma é segura (e por quê). | MVP | F03/F05 | I-09 |
| PRD-07 | Visual de escola bonito, consistente (design system). | MVP | F01 | I-10 |
| PRD-08 | Logo e identidade visual. | MVP | F00 (conceito) / F01 | I-11 |
| PRD-09 | "Um a mais" pago opcional no futuro, sem bloquear o núcleo. | Futuro | F12 | I-16 |
| PRD-10 | Interface de provedor de IA que permita outros provedores no futuro. | V1 | F03 (interface) / F12 | I-29, A-21 |
| PRD-11 | Idade mínima de 18 anos. | MVP | F02 | A-02 |

## CON — Contas e usuários
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| CON-01 | Login com conta Google. | MVP | F02 | M-04 |
| CON-02 | Login por e-mail e senha (confirmação de e-mail + recuperação de senha). | MVP | F02 | M-04, A-03 |
| CON-03 | Confirmação de e-mail obrigatória. | MVP | F02 | M-03 |
| CON-04 | Proteção anti-robô invisível (CAPTCHA) no cadastro/login. | MVP | F02 | M-03 |
| CON-05 | Perfil mínimo: nome de exibição opcional, idioma da interface, fuso horário. | MVP | F02 | M-03 |
| CON-06 | Aceite de termos e privacidade versionados, com registro de consentimento. | MVP | F02 | A-03 |
| CON-07 | Sair deste aparelho e "sair de todos os aparelhos". | MVP | F02 | M-03 |
| CON-08 | Excluir conta no app + página web para pedir exclusão (exigência das lojas). | MVP | F02/F10 | A-04 |
| CON-09 | Exportar meus dados (arquivo JSON). | MVP | F02 | A-03 |
| CON-10 | Mensagens que não revelam se um e-mail tem conta (anti-enumeração). | MVP | F02 | M-05 |
| CON-11 | Troca de e-mail com confirmação nos dois endereços. | V1 | F02 | M-03 |
| CON-12 | Sessão persistente com renovação automática e segura. | MVP | F02 | M-03 |
| CON-13 | Multi-aparelho: progresso sincroniza; a chave de API não. | MVP | F02/F03 | A-22 |

## BYOK — Chave do usuário
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| BYOK-01 | Tela educativa: o que é chave de API, como criar, créditos, limite de gasto, por que fica só no aparelho. | MVP | F03 | I-02, I-09 |
| BYOK-02 | Informar sobre créditos de API inclusos em alguns planos, sempre com link oficial. | MVP | F03 | A-01 |
| BYOK-03 | Validar a chave sem gastar tokens (endpoint de listagem de modelos). | MVP | F03 | A-12 |
| BYOK-04 | Chave guardada cifrada no aparelho; no nativo, no Keystore/Keychain do sistema. | MVP | F03/F10 | I-25 |
| BYOK-05 | Chave enviada somente ao domínio do provedor (allowlist no código + CSP no navegador). | MVP | F03 | I-25, A-07 |
| BYOK-06 | Chave nunca em logs, analytics, Supabase, URLs, e-mails, relatórios de erro, backups. | MVP | F03 | I-25 |
| BYOK-07 | A interface mostra só uma "impressão digital" da chave (ex.: `…a1B2`). | MVP | F03 | I-25 |
| BYOK-08 | Remover chave + instruções para revogá-la na Console ("botão de pânico"). | MVP | F03 | A-12 |
| BYOK-09 | PIN opcional para desbloquear a chave na web. | V1 | F03 | I-25 |
| BYOK-10 | Chave vinculada ao usuário logado naquele aparelho (troca de conta exige a chave de novo). | MVP | F03 | A-22 |
| BYOK-11 | Painel de consumo: tokens e custo estimado por dia/semana/mês e por recurso. | MVP | F03 | I-02 |
| BYOK-12 | Limites de gasto no app (aviso em 80%, bloqueio em 100%), configuráveis. | MVP | F03 | A-11 |
| BYOK-13 | Erros claros: chave inválida, sem créditos, limite de taxa, sobrecarga, offline. | MVP | F03 | M-03 |
| BYOK-14 | Perfis de qualidade (Econômico/Equilibrado/Máximo) com custo estimado. | MVP | F03/F04 | A-11 |
| BYOK-15 | Testes automatizados provando que a chave não vai a nenhum outro domínio. | MVP | F03 | I-26 |
| BYOK-16 | Código-fonte com comentários e documento de transparência explicando a proteção da chave. | MVP | F03 | I-26 |

## TUT — Tutor (IA)
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| TUT-01 | Conversa no idioma-alvo adaptada ao nível do aluno. | MVP | F04 | I-01 |
| TUT-02 | Correções estruturadas citando o trecho literal do aluno, com explicação. | MVP | F04 | I-30 |
| TUT-03 | Modos de feedback: Gentil, Equilibrado, Sem filtro (opt-in). | MVP | F04 | I-13, I-14 |
| TUT-04 | Desligar o modo sem filtro a qualquer momento; abrandamento automático se houver frustração. | MVP | F04 | I-14 |
| TUT-05 | Quantidade e momento das correções configuráveis. | V1 | F04 | A |
| TUT-06 | Idioma das explicações progressivo (português → idioma-alvo conforme o nível). | MVP | F04/F06 | A-26 |
| TUT-07 | "O que o tutor sabe sobre você": memória visível e editável. | MVP | F04 | A-13 |
| TUT-08 | Resumo contínuo da conversa para economizar tokens. | MVP | F04 | I-07 |
| TUT-09 | Botão "essa correção está errada". | MVP | F04 | A-27 |
| TUT-10 | Respostas em streaming (aparecem enquanto são geradas). | MVP | F04 | A |
| TUT-11 | Emoção do mascote derivada da resposta (campo curto, poucos tokens). | MVP | F04/F08 | I-07 |
| TUT-12 | O tutor nunca afirma ter ouvido áudio; feedback de fala só a partir de evidências medidas. | MVP | F07 | I-30 |
| TUT-13 | Notas culturais com fonte; sem aconselhamento jurídico/visto. | MVP | F04/F06 | I-21, I-23 |
| TUT-14 | Persona consistente; admite ser IA quando perguntado. | MVP | F04 | I-05 |
| TUT-15 | Texto da IA renderizado com segurança (sem HTML, sem imagens externas). | MVP | F04 | M-05 |

## NIV — Nivelamento
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| NIV-01 | Nivelamento em forma de bate-papo, "que não é prova". | MVP | F05 | I-18 |
| NIV-02 | Instruir a responder só no idioma-alvo; lembrete gentil se trocar de idioma. | MVP | F05 | I-18 |
| NIV-03 | Saída "sou iniciante total" sem constrangimento. | MVP | F05 | A |
| NIV-04 | Adaptativo (sobe/desce de dificuldade), 6–12 turnos, 5–10 min. | MVP | F05 | I-18 |
| NIV-05 | Resultado CEFR com subnível, confiança e evidências citadas. | MVP | F05 | I-18 |
| NIV-06 | Agregação do nível feita em código determinístico, não pela IA. | MVP | F05 | M-11 |
| NIV-07 | Refazer o nivelamento; re-nivelamento periódico. | MVP | F05/F06 | I-19 |
| NIV-08 | Etapa de fala opcional no nivelamento (depois da F07). | V1 | F07 | I-31 |
| NIV-09 | Transcrição do nivelamento só no aparelho; servidor guarda resultado e citações curtas. | MVP | F05 | A-39 |

## OBJ — Objetivos e personalização
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| OBJ-01 | Onboarding pergunta objetivos (vários ao mesmo tempo). | MVP | F05 | I-20, I-21 |
| OBJ-02 | Detalhes do objetivo: profissão, país/cidade, data, interesses. | MVP | F05 | I-21, I-23 |
| OBJ-03 | Objetivos editáveis a qualquer momento; a trilha se replaneja sem perder progresso. | MVP | F05/F06 | I-22 |
| OBJ-04 | Pacotes temáticos (profissões, países, viagem) entrelaçados em toda a trilha. | MVP | F06 | I-20, I-21 |
| OBJ-05 | Contagem regressiva para viagem/mudança com pacote "pronto para a viagem". | V1 | F06/F09 | A-25 |
| OBJ-06 | Sotaque/variante conforme objetivo (ex.: en-AU para Austrália). | V1 | F05/F07 | A-24 |
| OBJ-07 | Mensagem "Vá pronto para o que você quer fazer" presente no produto e no site. | MVP | F01/F11 | I-22 |
| OBJ-08 | Objetivo de preparação para exame (prática, sem promessa oficial). | Futuro | F12 | A-23 |

## TRI — Trilha de aprendizado
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| TRI-01 | Trilha completa de Pre-A1 até C2 ("falar tudo em inglês"). | MVP (estrutura) | F06 | I-15, I-19 |
| TRI-02 | Estrutura Nível → Módulo → Unidade → Lição → Atividade. | MVP | F06 | I-12 |
| TRI-03 | Lições diárias de 5 a 30 minutos conforme a meta. | MVP | F06 | I-39 |
| TRI-04 | Revisão espaçada (FSRS) de vocabulário e frases. | MVP | F06 | I-39 |
| TRI-05 | Catálogo de tipos de atividade (texto, escuta, fala, escrita, roleplay). | MVP | F06/F07 | I-12 |
| TRI-06 | Lições geradas por IA dentro de restrições, validadas e guardadas em cache. | MVP | F06 | I-07 |
| TRI-07 | Progresso visível por habilidade; marcos; subir de nível. | MVP | F06 | I-15 |
| TRI-08 | XP, meta diária, sequência com proteção; sem padrões manipulativos. | MVP | F06 | A-15 |
| TRI-09 | Revisões funcionam offline. | V1 | F06 | A-10 |
| TRI-10 | Re-nivelamento mensal. | MVP | F06 | I-39 |
| TRI-11 | "Certificado PapeAI" claramente não oficial. | Futuro | F12 | A-31 |
| TRI-12 | Acompanhamento de longo prazo (meses/anos) com histórico de evolução. | MVP | F06/F09 | I-39 |

## VOZ — Fala e escuta
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| VOZ-01 | O tutor fala (TTS) com legendas opcionais. | MVP | F07 | I-27 |
| VOZ-02 | Modos de legenda: sempre / tocar para revelar (desafio) / desligado. | MVP | F07 | I-27 |
| VOZ-03 | Velocidade ajustável e "repetir mais devagar". | MVP | F07 | I-28 |
| VOZ-04 | Opções de voz e sotaque. | MVP | F07 | I-29 |
| VOZ-05 | Reconhecimento literal (verbatim): sem "arredondar", hesitações preservadas. | MVP | F07 | I-30 |
| VOZ-06 | Avaliação de pronúncia por fonema em exercícios com texto conhecido. | MVP | F07 | I-31, I-36 |
| VOZ-07 | Prosódia: entonação, ritmo, pausas, velocidade, tonicidade. | V1 | F07 | I-31 |
| VOZ-08 | Mostrar exatamente o que foi entendido, com confiança por palavra. | MVP | F07 | I-30, I-32 |
| VOZ-09 | Áudio processado no aparelho; nunca enviado ao nosso servidor. | MVP | F07 | A-32 |
| VOZ-10 | Provedores de voz em nuvem opcionais com a chave do próprio usuário. | V1 | F07 | I-29 |
| VOZ-11 | Métricas calibradas com dados rotulados; limites comunicados com honestidade. | MVP | F07 | I-36 |
| VOZ-12 | Alternativa sem fala para quem não pode/quer falar (acessibilidade). | MVP | F07 | A-09 |
| VOZ-13 | Modelos de voz baixados sob demanda (de preferência em Wi-Fi), com cache. | V1 | F07 | A |

## MAS — Mascote 3D
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| MAS-01 | Mascote 3D de animal, low poly, bordas suaves e arredondadas. | MVP | F08 | I-04..I-08 |
| MAS-02 | Textura 128×128 (atlas de paleta). | MVP | F08 | I-08 |
| MAS-03 | Animações: parado, ouvindo, pensando, falando, reações. | MVP | F08 | I-08 |
| MAS-04 | Sincronia labial simples com a fala. | V1 | F08 | I-27 |
| MAS-05 | Orçamento de performance (triângulos, KB, FPS). | MVP | F08 | I-07 |
| MAS-06 | Renderização sem tokens; emoção vem de um campo enum da resposta. | MVP | F08 | I-07 |
| MAS-07 | Movimento reduzido / ocultar mascote / versão 2D de reserva. | MVP | F08 | A-09 |
| MAS-08 | Direitos da arte e da marca protegidos (licença separada). | MVP | F00/F08 | A-16 |

## ENG — Engajamento
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| ENG-01 | Lembrete diário local no horário escolhido. | MVP | F09 | I-39 |
| ENG-02 | Horário silencioso e limite de frequência de notificações. | MVP | F09 | A-15 |
| ENG-03 | E-mails transacionais (código de acesso, confirmação, exclusão de conta). | MVP | F02/F09 | I-41 |
| ENG-04 | E-mails de engajamento opt-in (resumo semanal, relatório mensal, retorno, contagem regressiva). | MVP | F09 | I-41 |
| ENG-05 | Descadastro em um clique; preferências por tipo de e-mail. | MVP | F09 | A-03 |
| ENG-06 | SPF, DKIM e DMARC no domínio de envio. | MVP | F09 | I-41 |
| ENG-07 | Push web/nativo opcional. | V1 | F09/F10 | I-39 |
| ENG-08 | Tom das mensagens segue o modo do professor (sem filtro só com opt-in). | V1 | F09 | I-14 |

## SEG — Segurança
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| SEG-01 | RLS em todas as tabelas expostas; negar por padrão. | MVP | F02 | M-03, M-05 |
| SEG-02 | Segredos de servidor só em Edge Functions/secrets; nunca no cliente/repositório. | MVP | F02 | M-03 |
| SEG-03 | CSP restritiva e cabeçalhos de segurança. | MVP | F01 | A-07 |
| SEG-04 | robots.txt + noindex no app (lembrando: robots.txt não é proteção). | MVP | F01 | M-06 |
| SEG-05 | security.txt + SECURITY.md + canal de divulgação responsável. | MVP | F01/F11 | A-37 |
| SEG-06 | Origens separadas: site institucional x app. | MVP | F01 | A-08 |
| SEG-07 | Nenhum script de terceiros na origem do app. | MVP | F01 | A-07 |
| SEG-08 | Cadeia de suprimentos: lockfile, auditoria, Dependabot, CodeQL, gitleaks, Actions fixadas. | MVP | F01 | A-06 |
| SEG-09 | Verificação de existência e reputação de pacotes antes de instalar (anti-slopsquatting). | MVP | F00+ | A-06 |
| SEG-10 | MFA em todas as contas de desenvolvedor. | MVP | F00 | A-05 |
| SEG-11 | Camadas de usuário não expostas: schema privado, grants por coluna, sem enumeração, erros sem detalhes internos. | MVP | F02 | M-05 |
| SEG-12 | Limites de taxa (Auth e Edge Functions). | MVP | F02 | M-03 |
| SEG-13 | Testes de segurança automatizados (RLS, vazamento de chave, allowlist de rede). | MVP | F02/F03 | I-26 |
| SEG-14 | Plano de resposta a incidentes. | MVP | F11 | A-20 |
| SEG-15 | Revisão de segurança em todo portão. | MVP | todas | M-03 |
| SEG-16 | Android: sem backup de segredos, tela da chave protegida contra captura, App Links verificados. | MVP | F10 | I-25 |
| SEG-17 | Hook do Claude Code bloqueando gravação de padrões de chave em arquivos. | V1 | F01 | A-06 |

## PRIV — Privacidade e LGPD
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| PRIV-01 | Política de privacidade e termos em pt-BR, versionados. | MVP | F02/F11 | A-03 |
| PRIV-02 | Minimização: servidor guarda só o necessário para progresso. | MVP | F02 | M-03 |
| PRIV-03 | Transcrições, áudio e uso de tokens só no aparelho por padrão. | MVP | F03/F04/F07 | A-39 |
| PRIV-04 | Direitos do titular no app: acesso, correção, exclusão, portabilidade, revogação. | MVP | F02 | A-03 |
| PRIV-05 | Consentimento explícito para e-mails de engajamento e provedores de voz em nuvem. | MVP | F07/F09 | A-03 |
| PRIV-06 | Sem cookies de rastreamento nem analytics de terceiros. | MVP | F01 | A-19 |
| PRIV-07 | Dados do servidor na região de São Paulo. | MVP | F02 | A-03 |
| PRIV-08 | Canal de contato de privacidade (encarregado). | MVP | F11 | A-03 |
| PRIV-09 | Retenção definida por tipo de dado. | MVP | F02/F11 | A-39 |
| PRIV-10 | Explicar que as conversas vão direto à Anthropic, sob a conta do próprio usuário. | MVP | F03 | A-01 |

## RNF — Não funcionais
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| RNF-01 | Infraestrutura com custo R$ 0 no desenvolvimento; custos mínimos explícitos. | MVP | F00 | I-33 |
| RNF-02 | Mobile-first e responsivo. | MVP | F01 | I-25 |
| RNF-03 | Acessibilidade WCAG 2.2 nível AA. | MVP | F01+ | A-09 |
| RNF-04 | Interface internacionalizada (pt-BR e inglês). | MVP | F01 | A-30 |
| RNF-05 | Performance: LCP < 2,5 s em 4G; JS inicial ≤ ~250 KB gzip (meta a validar). | MVP | F01 | I-07 |
| RNF-06 | PWA instalável. | MVP | F01 | I-35 |
| RNF-07 | Tolerância a rede ruim; fila de sincronização. | V1 | F02/F06 | A-10 |
| RNF-08 | Compatibilidade: navegadores modernos (Chrome, Edge, Firefox, Safari) e Android recente. | MVP | F01/F10 | A-38 |
| RNF-09 | Observabilidade sem dados pessoais. | V1 | F11 | A-19 |
| RNF-10 | Modularidade com fronteiras verificadas pelo lint. | MVP | F01 | I-35 |

## DEV — Processo de desenvolvimento
| ID | Requisito | Prior. | Fase | Origem |
|---|---|---|---|---|
| DEV-01 | Desenvolvimento por fases com portões aprovados pelo dono. | MVP | todas | M-08 |
| DEV-02 | `CLAUDE.md` roteador + `00-ESTADO-ATUAL.md` sempre atualizado. | MVP | F00 | M-10 |
| DEV-03 | Controle de alucinação no desenvolvimento. | MVP | F00 | M-11 |
| DEV-04 | ADRs para decisões. | MVP | F00 | M-09 |
| DEV-05 | Documentos de dados e migrações sempre sincronizados. | MVP | F02+ | M-11 |
| DEV-06 | Evals de prompts antes de mudar prompt ou modelo. | MVP | F04+ | M-11 |
| DEV-07 | CI obrigatória para merge. | MVP | F01 | M-02 |
| DEV-08 | Cada fase explica o que o dono vai aprender. | MVP | todas | I-35 |
