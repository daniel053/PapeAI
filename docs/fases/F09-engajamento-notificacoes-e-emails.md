# F09 — Engajamento: rotina, notificações e e-mails

> **Status:** ⏳ Não iniciada · **Marco ao final: M2 — Beta web fechado**

## Objetivo
Ajudar o aluno a voltar todo dia — **sem manipulação**: lembretes locais com horário silencioso, e-mails transacionais com domínio próprio, e-mails de engajamento **opt-in** (resumo semanal, relatório mensal, retorno, contagem regressiva da viagem), descadastro em um clique — e abrir o **beta fechado** para amigos.

## Documentos desta fase
1. `../pedagogia/rotina-engajamento-notificacoes-emails.md`
2. `../seguranca/privacidade-lgpd.md` (consentimentos)
3. `../seguranca/supabase-rls-e-backend.md` (funções internas, HMAC)
4. `../arquitetura/custos-e-limites.md` (limite de 100 e-mails/dia)
5. `../seguranca/autenticacao-e-sessoes.md` (SMTP próprio, modelos do Auth, publicação do OAuth)

## Pré-requisitos
- F08 aprovada. Q-04 (domínio) e Q-18 respondidas. Q-14 (testadores) encaminhada.

## Escopo
**Inclui:** domínio + DNS + SPF/DKIM/DMARC, Resend, SMTP próprio no Supabase Auth, modelos de e-mail pt-BR, Edge Functions de envio e resumos, `pg_cron`, `private.email_log`, idempotência e escalonamento, função `unsubscribe` (HMAC), central de preferências, lembretes locais (PWA), push web opcional, beta fechado (convites, canal de feedback, triagem).
**Não inclui:** notificações nativas Android (F10), novidades do produto/marketing (F11).

## Passos
### A. Domínio e e-mail
- [ ] Comprar domínio (se aprovado), DNS na Cloudflare, MFA e bloqueio de transferência no registrador.
- [ ] Migrar site e app para `<dominio>` e `app.<dominio>`; atualizar CSP, redirect URLs do Auth e do Google.
- [ ] Resend: conta com MFA, domínio verificado, SPF/DKIM/DMARC (`p=none` inicial), subdomínio de envio.
- [ ] Supabase Auth com SMTP próprio; modelos do Auth em pt-BR com a marca.

### B. Funções e agendamentos
- [ ] `send-email` (interna), `weekly-summary`, `monthly-report`, `reengagement`, `travel-countdown` com idempotência (`private.email_log`) e escalonamento por dia da semana (teto diário).
- [ ] `pg_cron` configurado; `private.job_runs`.
- [ ] Modelos React Email/MJML + versão texto; sem rastreamento.

### C. Consentimento e descadastro
- [ ] Opt-in por tipo nas Configurações e no onboarding (desligado por padrão) → `consent_records`.
- [ ] `unsubscribe` com token HMAC + cabeçalhos `List-Unsubscribe`/`List-Unsubscribe-Post`.

### D. Lembretes
- [ ] Lembretes locais (PWA instalado) no horário escolhido, horário silencioso, máximo 1/dia, redução automática quando ignorados.
- [ ] Textos por modo (sem filtro só com opt-in).
- [ ] Push web opcional (VAPID nos secrets) — se aprovado.

### E. Beta fechado (M2)
- [ ] Publicar a tela de consentimento do Google (sair do modo "Testing") ou cadastrar testadores como usuários de teste.
- [ ] Convidar testadores (meta: os 12+ que também servirão para a Play — Q-14); canal de feedback (BL-17).
- [ ] Triagem semanal de feedback → backlog/correções.

## Segurança nesta fase
Seção F09 do checklist: funções internas não públicas, HMAC, DNS seguro, e-mails sem dados sensíveis.

## Testes e verificações
- Unitários: idempotência, escalonamento, geração/validação do HMAC, regras de frequência.
- Ferramenta de teste de e-mail (verificação SPF/DKIM/DMARC) com resultado no relatório.
- Recebimento real de cada tipo de e-mail na caixa do dono (não spam).

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| E-mails caindo no spam | SPF/DKIM/DMARC, subdomínio de envio, conteúdo limpo, sem rastreadores |
| Estourar 100 e-mails/dia | Escalonamento + prioridade para transacionais |
| Lembretes irritantes | Limites, horário silencioso, redução automática |
| Feedback do beta sem organização | Triagem semanal com rótulos |

## O que você vai aprender
- Como funciona a entrega de e-mail (SPF, DKIM, DMARC) e por que domínios próprios importam.
- O que é uma tarefa agendada (cron) e idempotência.

## Portão de aprovação F09 (M2)
**Critérios:**
- [ ] Todos os e-mails do catálogo (exceto marketing) funcionando, com opt-in e descadastro em um clique.
- [ ] Lembretes respeitando horário silencioso e limites.
- [ ] Domínio próprio com autenticação de e-mail aprovada nos testes.
- [ ] Beta fechado aberto com testadores ativos.

**Roteiro de teste do dono (20 min + acompanhamento do beta):**
1. Ative o resumo semanal e peça à IA o disparo de teste; confira a caixa de entrada (não spam).
2. Clique em "descadastrar" no e-mail e confirme que não chega mais.
3. Defina o lembrete para daqui a 5 minutos e espere a notificação.
4. Convide 2 amigos para o beta e colete as primeiras impressões.
5. Diga **"aprovado F09"** — M2 atingido. 🎉
