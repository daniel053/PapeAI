# 01 — Visão do produto

## Em uma frase
**PapeAI é uma escola de idiomas gratuita e de código aberto, com um tutor-mascote 3D que conversa com você e monta a trilha para o seu objetivo — usando a sua própria chave de IA, que nunca sai do seu aparelho.**

## O problema
1. **Pagar duas vezes:** apps de idiomas cobram assinatura; quem já paga IA paga de novo pelo app.
2. **Conteúdo genérico:** o dev aprende "the cat is on the table" em vez de "the build is failing on main".
3. **Transcrição que "arredonda":** reconhecimento de fala comum corrige o que você disse para a palavra mais provável — e o feedback de pronúncia vira ficção.
4. **Chaves expostas:** muitos apps que pedem sua chave de IA a mandam para servidores deles.
5. **Tom único:** há quem queira gentileza e há quem queira a verdade nua e crua.
6. **Aprender idioma leva meses/anos:** sem rotina, acompanhamento e lembretes, a pessoa desiste.

## A solução — 6 pilares
| Pilar | O que significa na prática | Onde está detalhado |
|---|---|---|
| **1. Grátis com BYOK** ("traga sua chave") | O app não cobra nada. A pessoa cola a chave de API dela e paga só o consumo, direto ao provedor, vendo o custo de cada lição. | `seguranca/cofre-da-chave-api.md`, `ia/economia-de-tokens-e-custos.md` |
| **2. Tutor-mascote 3D** | Animal estilizado, low poly, bordas suaves, textura 128×128, animado. Renderizado no aparelho: **custa zero tokens**. | `design/mascote-3d.md` |
| **3. Trilha guiada pelo objetivo** | Trabalho (ex.: dev), viagem (ex.: Austrália), mudança, estudos, cultura. O objetivo entra em todas as lições. *"Vá pronto para o que você quer fazer."* | `pedagogia/personalizacao-por-objetivo.md` |
| **4. Escuta precisa** | Mostramos exatamente o que foi entendido, palavra por palavra, com confiança, pausas, ritmo e entonação. A IA de texto nunca "finge que ouviu". | `voz/` |
| **5. Professor do seu jeito** | Gentil, equilibrado ou sem filtro (opt-in, desligável a qualquer momento). | `ia/personalidade-e-modos-de-feedback.md` |
| **6. Segurança verificável** | Código aberto + CSP + RLS + testes automatizados que provam que a chave não vaza. | `seguranca/` |

## Assinatura do Claude x chave de API
> Este é o ponto que mais muda a ideia original ("para quem tem assinatura do Claude Code"). Verificado em 2026-11-26.

| | Assinatura do Claude (Free/Pro/Max — inclui Claude Code) | Chave de API (Claude Console) |
|---|---|---|
| O que é | Plano de uso dos apps da Anthropic (claude.ai, Claude Code) | Credencial para programas chamarem a API |
| Como se paga | Mensalidade | Pré-pago por consumo (créditos), cobrança **separada** da assinatura |
| Pode ser usada no PapeAI? | **Não.** A Anthropic esclareceu (fev/2026) que usar o login/tokens OAuth de planos de consumo em ferramentas de terceiros viola os termos, e que terceiros não podem oferecer "login com claude.ai" sem aprovação prévia. | **Sim.** É o caminho oficial para apps de terceiros. |

**O que isso significa para o PapeAI:**
- O app pede uma **chave de API** criada em `platform.claude.com` (Console). Uso de API nunca é cobrado do plano claude.ai.
- **Boa notícia para assinantes:** nas regras atuais, os planos **Max, Ultra e Team incluem créditos mensais de API** (Free, Pro e Enterprise não). O assinante resgata em claude.ai → Settings → Billing, vinculando o plano a uma organização da Console. Os créditos chegam todo mês, **não acumulam** e não pagam o Claude Code. As regras podem mudar — o app sempre mostra o link oficial em vez de prometer.
- **Público inicial:** quem tem chave de API com créditos ou um plano que inclui créditos de API. Mitigações: tutorial claro no onboarding, custo por lição visível e baixo, e — no futuro — outros provedores de IA (ver `06-BACKLOG-DE-IDEIAS.md`).
- **Para desenvolver o PapeAI:** você também precisará de uma chave de API com créditos (ou créditos do seu plano, se for Max/Ultra/Team). Dica de economia: o design dos prompts pode ser iterado aqui no Claude Code (coberto pela sua assinatura); só os testes de integração e as evals gastam créditos de API.

Fontes: [Anthropic — API credits for subscribers](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers) · [The Register (20/02/2026)](https://www.theregister.com/2026/02/20/anthropic_clarifies_ban_third_party_claude_access) · [Gigazine (20/02/2026)](https://gigazine.net/gsc_news/en/20260220-anthropic-third-party-block)

## Personas (fictícias)
| Persona | Nível | Objetivo | O que precisa do app |
|---|---|---|---|
| **Lucas, dev júnior, 24** | B1 | Trabalhar remoto para empresa estrangeira | Daily/standup, code review, descrever PR, entrevista técnica e comportamental, e-mails e Slack. Tem chave de API. |
| **Marina, rumo à Austrália, 27** | A2 | Intercâmbio em Sydney (curso + trabalho de meio período) daqui a 6 meses | Aeroporto e imigração, alugar quarto, emprego em hospitalidade, sotaque e gírias australianas, segurança (praias com bandeiras, crocodilos no norte, sol). Contagem regressiva da viagem. Regras de visto: só fontes oficiais. |
| **Seu Carlos, 52** | Pre-A1 | Entender séries e viajar com a família | Explicações em português, ritmo lento, modo gentil, legendas sempre, fala mais devagar. |
| **Bia, gerente de produto, 34** | B2 → C1 | Reuniões globais com naturalidade | Correções de naturalidade e registro, modo **sem filtro**, sem legendas (desafio). |

## Jornada do usuário (de ponta a ponta)
1. **Descobre** o PapeAI pelo site institucional (indexado em buscadores).
2. **Abre o app** (web; depois Android).
3. **Cria conta** com Google ou e-mail com código; aceita termos e privacidade; confirma ter 18+.
4. **Entende a chave:** tela educativa "o que é chave de API, quanto custa, como criar, como pôr limite de gasto, por que ela fica só aqui".
5. **Cola a chave:** validação gratuita (não gasta tokens); a chave é cifrada no aparelho.
6. **Onboarding:** idioma nativo, idioma-alvo, objetivos (vários), detalhes (profissão, país, data), meta diária, sotaque, modo do professor, legendas.
7. **Nivelamento:** bate-papo de 5–10 min só no idioma-alvo (ou "sou iniciante total").
8. **Resultado:** nível estimado (ex.: A2.2) com evidências das próprias frases, pontos fortes e 3 focos.
9. **Primeira lição** com o mascote: aquecimento → conteúdo → prática → conversa → fechamento.
10. **Rotina diária:** lembrete local no horário escolhido; revisão espaçada; XP e sequência.
11. **Semanal:** resumo por e-mail (se aceitou); mini-desafio.
12. **Mensal:** conversa de re-nivelamento; relatório de evolução.
13. **Marcos:** subir de nível; contagem regressiva da viagem com pacote "pronto para a viagem".
14. **Avançado (C1/C2):** conversa livre, naturalidade, registro, nuances — "falar tudo em inglês".

## Princípios de produto
1. **O objetivo do aluno manda** — o conteúdo serve ao que a pessoa vai fazer com o idioma.
2. **Verdade acima de agradar** — mostrar o que realmente foi dito; o modo sem filtro é escolha, nunca imposição.
3. **Inteligibilidade, não sotaque perfeito** — ser entendido é a meta; sotaque brasileiro não é erro.
4. **Constância vence intensidade** — 10 minutos por dia valem mais que 3 horas por mês.
5. **Privacidade por padrão** — o mínimo no servidor; o resto no aparelho.
6. **Custo transparente** — cada lição mostra tokens e custo estimado.
7. **Sem padrões manipulativos** — nada de culpa, chantagem emocional ou notificações abusivas.
8. **Acessível** — legendas, alternativas sem fala, movimento reduzido, leitores de tela.
9. **Honestidade sobre a IA** — "a IA pode errar"; botão para reportar correção errada.

## Não-objetivos (o que NÃO vamos fazer)
- Não somos certificadora: o nível é **estimativa** baseada no CEFR, não certificado oficial.
- Não guardamos sua chave, suas conversas nem seus áudios no servidor.
- Não vendemos dados e não teremos anúncios.
- Não damos aconselhamento jurídico, de visto ou imigração (indicamos fontes oficiais).
- Não substituímos preparação oficial para exames (IELTS/TOEFL) — ajudamos a praticar.
- Não atendemos menores de 18 anos (ADR-0010).
- Não é rede social: sem ranking público no início.

## Como saberemos que deu certo (métricas que respeitam privacidade)
- **Para o aluno (no app):** minutos por semana, sequência, palavras retidas, evolução de nível, custo por lição.
- **Para o projeto (agregado no banco, sem rastreadores de terceiros):** contas criadas, ativos por semana, lições concluídas, retenção D7/D30, relatos de feedback.
- **Qualidade da IA:** taxa de "correção errada" reportada, resultados das evals (`ia/avaliacoes-de-prompts-evals.md`).

## Sustentabilidade
- Núcleo **sempre gratuito**.
- Futuro: "um a mais" opcional que o usuário goste (cosméticos do mascote, pacotes de voz, temas extras) e/ou apoio (GitHub Sponsors, Pix). Ver F12.
- Custos do projeto: perto de zero (planos gratuitos) + domínio + taxa única da Play Store. Ver `arquitetura/custos-e-limites.md`.

## Marcos
| Marco | Quando | Significado |
|---|---|---|
| **M1 — Eu uso** | Fim da F04 | Você estuda com o tutor em texto no navegador. |
| **M2 — Beta web fechado** | Fim da F09 | Amigos testam a experiência completa (voz, mascote, trilha, lembretes) no navegador. |
| **M3 — Android** | Fim da F10 | APK no seu celular + teste fechado na Google Play. |
| **M4 — Lançamento público** | Fim da F11 | Repositório público, site no ar, app na loja. |
| **M5 — Evolução** | F12+ | Premium opcional, novos idiomas, iOS. |
