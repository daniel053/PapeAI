# UX — telas, fluxos e acessibilidade

## Mapa de telas
```text
Site institucional (indexável)          App (app.<dominio>, nunca indexado)
├─ Início                               ├─ Boas-vindas
├─ Como funciona                        ├─ Entrar / Criar conta (Google · e-mail com código)
├─ Segurança e transparência            ├─ Termos + Privacidade + 18+ (primeiro acesso)
├─ Perguntas frequentes                 ├─ "Sua chave, seu controle" (educativa) → Colar chave → Validação
├─ Privacidade · Termos                 ├─ Onboarding: idioma nativo → idioma-alvo → objetivos → detalhes
└─ Solicitar exclusão de conta          │             → meta diária → sotaque → professor → legendas
                                        ├─ Nivelamento (bate-papo) → Resultado
                                        ├─ Início (trilha, meta do dia, sequência, mascote)
                                        ├─ Lição (player de atividades)
                                        ├─ Conversa livre / Roleplay
                                        ├─ Revisão (SRS)
                                        ├─ Progresso (nível, habilidades, histórico)
                                        └─ Configurações
                                           ├─ Conta (sair, sair de todos, excluir)
                                           ├─ Chave de API (impressão digital, trocar, remover, "como protegemos")
                                           ├─ Consumo e limites (tokens, custo, orçamentos, perfil de qualidade)
                                           ├─ Professor (modo, correções, idioma das explicações)
                                           ├─ Voz e legendas (voz, sotaque, velocidade, legendas, microfone)
                                           ├─ Objetivos
                                           ├─ Notificações e e-mails
                                           ├─ O que o tutor sabe sobre você (memória)
                                           ├─ Meus dados (exportar, armazenamento local, apagar conversas)
                                           └─ Sobre (versão, código aberto, segurança, licenças)
```

## Fluxos críticos (detalhe)
### Colar a chave (F03)
1. Tela educativa curta (3 cartões): **O que é** → **Quanto custa** (estimativa por perfil) → **Por que fica só aqui** (+ link "como protegemos").
2. Botão "Criar minha chave" abre a Console em nova aba; texto explica: criar chave só para o PapeAI e **definir limite de gasto**.
3. Campo de colar (oculto por padrão, botão olho), botão "Validar".
4. Resultado: ✓ "Chave válida (…a1B2)" · opcional "Testar créditos" · ✗ mensagens específicas (inválida, sem créditos, sem conexão).
5. Oferta: "Limpar a área de transferência".
6. Definir orçamento diário/mensal (sugestão pelo perfil).

### Primeira conversa (F04)
- Mascote se apresenta, explica os modos do professor e o botão "baixar o tom".
- Mostra como funcionam as correções (trecho destacado) e o botão "essa correção está errada".

### Nivelamento (F05)
- Barra de progresso **sem** números de pontuação; "pode parar quando quiser".
- Botão fixo "Responder em português não vale 😉" vira lembrete gentil quando necessário.

## Estados obrigatórios em toda tela
| Estado | O que mostrar |
|---|---|
| Carregando | Esqueleto + mascote `think` (quando houver IA) |
| Vazio | Explicação + próxima ação ("Nenhuma palavra ainda — faça sua primeira lição") |
| Erro de rede | Mensagem + "tentar de novo" |
| Erro da chave | Leva às Configurações → Chave |
| Sem créditos | Link para a cobrança da Console |
| Limite do app atingido | Opções de ajuste |
| Offline | O que funciona offline (revisões) |

## Acessibilidade (WCAG 2.2 AA — RNF-03)
- Navegação completa por teclado; foco visível; ordem lógica.
- Rótulos acessíveis em todos os controles; anúncios para leitores de tela quando a IA responde (região *live* educada).
- Contraste AA; **cor nunca é o único sinal** (ícones + texto na pronúncia).
- Alvos de toque ≥ 48 dp (Android) / ≥ 44 pt (iOS).
- Legendas sempre disponíveis para toda fala do tutor.
- Alternativa sem fala para toda atividade de fala (VOZ-12), sem perder progresso.
- `prefers-reduced-motion` respeitado (mascote e transições).
- Texto escalável até 200% sem quebrar layout.
- Tempo: nenhuma atividade com cronômetro obrigatório (desafios cronometrados são opcionais).
- Verificação automática com axe (E2E) + teste manual com leitor de tela (TalkBack) antes do M3.

## Responsividade
- **Mobile-first** (360–430 px de largura); tablet; desktop com coluna central (máx. ~720 px) e mascote ao lado.
- Teclado virtual não pode cobrir o campo da conversa.

## Microcopy — regras
1. Frases curtas, voz ativa, segunda pessoa ("você").
2. Sem jargão técnico na interface ("chave de API" é exceção, sempre com explicação a um toque).
3. Botões dizem o que fazem ("Validar chave", não "OK").
4. Erros dizem o que aconteceu e o que fazer.
5. Nada de culpa ou pressão (ver anti-padrões em `../pedagogia/rotina-engajamento-notificacoes-emails.md`).
