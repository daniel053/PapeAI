# Rotina, engajamento, notificações e e-mails

> Aprender um idioma leva meses e anos. O app precisa ajudar a **voltar todo dia** — sem manipular, sem encher o saco.

## Rotina diária
- Meta diária escolhida pelo aluno: 5, 10, 15, 20 ou 30 min (`daily_goal_minutes`).
- Sessão diária com estrutura fixa (`metodologia.md`).
- O "dia" de estudo segue o fuso do aluno (`profiles.timezone`).

## Notificações
### Lembretes locais (padrão — sem servidor)
| Lembrete | Quando | Regra |
|---|---|---|
| Diário | No horário escolhido (padrão 19h — Q-18) | Só se ainda não estudou no dia |
| Sequência em risco | 2 h antes do fim do dia, se não estudou | No máximo 1 por dia, só se a sequência ≥ 3 dias |
| Revisões acumuladas | Quando houver ≥ 20 cartões vencidos | No máximo 1 por semana |

Regras gerais (ENG-02):
- **No máximo 1 notificação por dia** por padrão.
- **Horário silencioso** (padrão 22h–8h) respeitado sempre.
- Depois de 3 lembretes ignorados seguidos, a frequência cai pela metade sozinha.
- Desligar tudo com um toque.

Web: notificações só quando instalado como PWA e com permissão. Android (F10): `@capacitor/local-notifications`.

### Push pelo servidor (V1, opcional)
Só para quem ativar; usado em re-engajamento leve. Web Push com chaves VAPID nos secrets das funções; Android via serviço de push do sistema (F10).

### Textos por modo (exemplos)
| Modo | Lembrete diário | Sequência em risco |
|---|---|---|
| Gentil | "Bora praticar 10 minutinhos? Estou te esperando 🙂" | "Sua sequência de 5 dias está quase lá! Uma lição rápida resolve." |
| Equilibrado | "Hora do inglês: 10 min hoje e amanhã você agradece." | "Faltam 2 horas para manter sua sequência de 5 dias." |
| Sem filtro (só com opt-in) | "Seu inglês não vai melhorar sozinho. 10 minutos. Agora." | "5 dias de sequência e você vai jogar fora? Sério?" |

## E-mails
### Catálogo
| E-mail | Tipo | Gatilho | Consentimento | Frequência máx. | Fase |
|---|---|---|---|---|---|
| Código de acesso / confirmação | Transacional (Auth) | Login/cadastro | Não precisa (serviço) | Por pedido (com limites) | F02 |
| Troca de e-mail | Transacional | Pedido do usuário | Não precisa | Por pedido | F02 |
| Boas-vindas | Serviço | Fim do onboarding | Não precisa | 1 vez | F09 |
| Conta excluída | Transacional | Exclusão | Não precisa | 1 vez | F02 |
| Resumo semanal | Engajamento | Domingo (fuso do aluno) | **Opt-in** | 1/semana | F09 |
| Relatório mensal | Engajamento | Dia 1 | **Opt-in** | 1/mês | F09 |
| Volte a praticar | Engajamento | 3, 7 e 21 dias sem estudar (depois para) | **Opt-in** | 3 no total por ausência | F09 |
| Contagem regressiva da viagem | Engajamento | 60, 30, 14, 7 e 1 dia antes de `target_date` | **Opt-in** | 5 por objetivo | F09 |
| Novidades do produto | Marketing | Lançamentos | **Opt-in** | 1/mês | F11 |
| Aviso de inatividade | Serviço | 30 dias antes da exclusão por inatividade (se Q-22) | Não precisa | 1 | F11 |

### Conteúdo do resumo semanal (exemplo)
- Minutos estudados, dias com meta cumprida, sequência atual.
- Palavras novas e retidas.
- 1 destaque ("você acertou 90% do passado simples!") e 1 foco para a próxima semana.
- Botão "Estudar agora" e link de preferências/descadastro.
- **Nunca:** transcrições, frases do aluno, custos detalhados de tokens, dados sensíveis.

### Tecnologia
- Envio: Edge Function `send-email` → API do Resend; agendamento: `pg_cron` → funções de resumo.
- Modelos: React Email (ou MJML), pt-BR, com versão **texto puro**.
- **Idempotência:** `private.email_log` impede repetir o mesmo e-mail no mesmo período.
- **Limite do plano gratuito (100/dia):** resumos distribuídos por dia da semana (ex.: usuários divididos em 7 grupos por hash do id); fila diária com teto de 80; transacionais têm prioridade.

### Conformidade e entregabilidade (ENG-05/06)
- Domínio próprio com **SPF, DKIM e DMARC** (começar com `p=none`, depois endurecer); envio por subdomínio (ex.: `mail.<dominio>`).
- Cabeçalhos `List-Unsubscribe` e `List-Unsubscribe-Post` (descadastro em um clique).
- Link de descadastro com **token HMAC** (usuário + tipo), sem precisar logar; idempotente.
- Central de preferências por tipo de e-mail no app.
- **Sem** pixels de rastreamento e sem rastreamento de cliques.
- Remetente claro ("PapeAI") e endereço de resposta monitorado ou aviso de "não responda".
- Consentimento registrado em `consent_records` a cada mudança.

## Anti-padrões proibidos
- Culpa ou chantagem emocional ("o mascote está chorando porque você sumiu").
- Urgência falsa ("última chance!" sem ser).
- Notificações em horário silencioso.
- Esconder o descadastro ou exigir login para descadastrar.
- Gamificação que premia gastar tokens.
- Perder progresso por quebrar a sequência (o progresso nunca some; só o contador de dias).
