# 04 — Perguntas em aberto (decisões do dono)

Como responder: no chat ("Q-03: tenho o Max") ou escrevendo em **Sua resposta**. A IA então atualiza a ADR e os documentos afetados.
**[bloqueia F00]** = precisa de resposta para fechar a F00. As demais podem esperar a fase indicada.

---

### Q-01 — Nome do projeto **[bloqueia F00]**
- **Pergunta:** "PapeAI" é o nome definitivo? O que ele significa para você (papo? papear? papagaio?)
- **Por que importa:** marca, domínio, mascote e registro de marca.
- **Recomendação:** manter "PapeAI" como nome de trabalho e, antes da F11, checar domínio (`.com.br`, `.app`), INPI (classes 9 e 41) e nomes nas lojas.
- **Sua resposta:** _

### Q-02 — Animal do mascote **[bloqueia F00]**
- **Pergunta:** qual animal? Opções (com prós e contras em `design/mascote-3d.md`): **papagaio** (fala e repete — combina com exercícios de repetição e talvez com o nome "Pape"), **capivara** (calma, querida, contraste engraçado com o modo sem filtro), **lobo-guará**, **bicho-preguiça** (piada pronta para o "falar mais devagar"), **tamanduá**, outro.
- **Restrição:** evitar coruja verde e qualquer coisa parecida com mascotes de apps conhecidos.
- **Recomendação:** papagaio, se "Pape" vier de papagaio; senão, capivara.
- **Sua resposta:** _

### Q-03 — Seu plano do Claude **[bloqueia F00]**
- **Pergunta:** você tem Pro, Max, Ultra ou Team?
- **Por que importa:** nas regras atuais, Max, Ultra e Team incluem créditos mensais de API (Pro não). Isso define seu custo de desenvolvimento e como explicamos ao usuário.
- **Recomendação:** criar uma organização na Claude Console só para o PapeAI, com uma chave de desenvolvimento e **limite de gasto baixo**.
- **Sua resposta:** _

### Q-04 — Orçamento mínimo aceitável **[bloqueia F00]**
- **Pergunta:** você aceita estes custos mínimos (quando chegar a hora)?
  - Créditos de API para testes (se o seu plano não incluir): a partir de alguns dólares.
  - Domínio próprio: ~R$ 40/ano (`.com.br`) — necessário para e-mails com boa entrega e login com aparência profissional. Pode esperar até a F09.
  - Google Play: taxa única de US$ 25 — só na F10.
  - Apple: US$ 99/ano — só se formos para iOS (F12).
- **Recomendação:** começar com R$ 0 (F00–F08) e decidir o domínio no início da F09.
- **Sua resposta:** _

### Q-05 — Stack: web primeiro + Capacitor **[bloqueia F00]**
- **Pergunta:** aprova a ADR-0001 (React + Vite como PWA; depois Capacitor gera o app Android com o mesmo código)?
- **Alternativa:** Expo/React Native (mais "nativo", porém 3D e modelos de voz no aparelho ficam mais difíceis).
- **Recomendação:** aprovar a ADR-0001.
- **Sua resposta:** _

### Q-06 — Login **[bloqueia F00]**
- **Pergunta:** aprova Google + e-mail com código de 6 dígitos (sem senha) — ADR-0006?
- **Recomendação:** aprovar. Sem senhas não há senha para vazar nem para esquecer.
- **Sua resposta:** _

### Q-07 — Idade mínima **[bloqueia F00]**
- **Pergunta:** aprova 18+ (ADR-0010)?
- **Recomendação:** aprovar. O titular da chave de API já precisa ser maior de idade na Console.
- **Sua resposta:** _

### Q-08 — Licença **[bloqueia F00]**
- **Pergunta:** qual licença para o código? E a marca/mascote?
- **Opções:** MIT, Apache-2.0 (permissivas) ou AGPL-3.0 (obriga quem hospedar versão modificada a publicar o código).
- **Recomendação (ADR-0005):** código **Apache-2.0**; conteúdo pedagógico **CC BY-SA 4.0**; nome, logo e mascote **com todos os direitos reservados** (qualquer um pode copiar o código, mas não a identidade).
- **Sua resposta:** _

### Q-09 — Limites do modo "sem filtro" (F04)
- **Pergunta:** até onde vai o "sem filtro"? Palavrão leve sim ou não? Nome do modo ("Sem filtro", "Brutal", "Sincerão")?
- **Recomendação:** sem palavrões; crítica só ao desempenho, nunca à pessoa; nome "Sem filtro".
- **Sua resposta:** _

### Q-10 — Conversas no servidor? (F04)
- **Pergunta:** transcrições das conversas ficam só no aparelho (padrão) ou o usuário pode optar por sincronizar entre aparelhos?
- **Recomendação:** só no aparelho no MVP (ADR-0011); sincronização opcional e cifrada fica no backlog.
- **Sua resposta:** _

### Q-11 — Idioma dos documentos e do código
- **Pergunta:** OK documentos em pt-BR e código/commits em inglês? README em inglês no lançamento?
- **Recomendação:** sim; no lançamento (F11), README bilíngue.
- **Sua resposta:** _

### Q-12 — Repositório dentro do OneDrive **[bloqueia F00]**
- **Pergunta:** podemos mover o repositório para fora do OneDrive (ex.: `C:\dev\PapeAI`)?
- **Por que importa:** o OneDrive tenta sincronizar `node_modules` (dezenas de milhares de arquivos), trava arquivos durante builds e enviaria arquivos `.env.local` com segredos para a nuvem.
- **Recomendação:** mover antes da F01 (passo a passo em `processo/ambiente-de-desenvolvimento-windows.md`).
- **Sua resposta:** _

### Q-13 — Docker no seu PC (F02)
- **Pergunta:** seu PC aguenta Docker Desktop (para rodar o Supabase localmente)?
- **Alternativa:** usar um projeto Supabase de desenvolvimento na nuvem (o plano gratuito permite 2 projetos).
- **Recomendação:** projeto de dev na nuvem; Docker é opcional.
- **Sua resposta:** _

### Q-14 — Testadores (F09/F10)
- **Pergunta:** você consegue reunir pelo menos 12 pessoas para testar o app Android por 14 dias seguidos?
- **Por que importa:** contas pessoais novas da Google Play precisam desse teste fechado antes de publicar.
- **Sua resposta:** _

### Q-15 — Voz na primeira versão (F07)
- **Pergunta:** aceita que a primeira versão use vozes do sistema/modelos locais (grátis) e que vozes "premium" e avaliação de pronúncia em nuvem sejam opcionais, com a chave do próprio usuário?
- **Recomendação:** sim (ADR-0007), com decisão final após o benchmark da F07.
- **Sua resposta:** _

### Q-16 — Modelo padrão do tutor (F04)
- **Pergunta:** preferência inicial entre Econômico (Haiku 5.5), Equilibrado (Sonnet 5.5) e Máximo (Opus 5.5)?
- **Recomendação:** o usuário escolhe; o **padrão** você decide no portão F04, olhando qualidade x custo medidos nas evals (ADR-0008).
- **Sua resposta:** _

### Q-17 — O "a mais" pago do futuro (F12)
- **Pergunta:** que tipo de extra você imagina? Cosméticos do mascote, vozes, pacotes temáticos, certificado bonito, apoio/doação?
- **Recomendação:** cosméticos + apoio voluntário; nunca bloquear aprendizado.
- **Sua resposta:** _

### Q-18 — Notificações e e-mails (F09)
- **Pergunta:** horário padrão do lembrete (sugestão: 19h)? E-mails de engajamento opt-in (desligados por padrão)?
- **Recomendação:** 19h, opt-in.
- **Sua resposta:** _

### Q-19 — Robôs de IA no site institucional (F11)
- **Pergunta:** bloquear robôs de treinamento de IA (GPTBot, CCBot, Google-Extended etc.) no site público?
- **Observação:** o app em si nunca é indexado; isso vale só para o site institucional.
- **Sua resposta:** _

### Q-20 — Revisão de conteúdo cultural (F06)
- **Pergunta:** você revisa (ou pede a alguém) as notas culturais e de segurança dos países antes de publicar?
- **Recomendação:** sim; conteúdo cultural gerado por IA fica marcado como "rascunho" até revisão humana.
- **Sua resposta:** _

### Q-21 — Sotaques (F05/F07)
- **Pergunta:** en-US como padrão e en-GB/en-AU como opções desde o início?
- **Sua resposta:** _

### Q-22 — Contas inativas (F11)
- **Pergunta:** excluir contas inativas após 24 meses, com aviso por e-mail 30 dias antes?
- **Recomendação:** sim (minimização de dados).
- **Sua resposta:** _

### Q-23 — Métricas do projeto (F11)
- **Pergunta:** nenhuma ferramenta de analytics (recomendado) ou contagens mínimas anônimas e opt-in?
- **Recomendação:** só contagens agregadas no próprio banco.
- **Sua resposta:** _

### Q-24 — "Mais modesto" ou "mais honesto"?
- **Pergunta:** no texto original, "professor mais modesto" era "mais honesto"?
- **Sua resposta:** _

### Q-25 — Explicações para iniciantes (F04)
- **Pergunta:** para A0–A1, explicações em português e conversa em inglês simples?
- **Recomendação:** sim, com imersão progressiva (`pedagogia/metodologia.md`).
- **Sua resposta:** _
