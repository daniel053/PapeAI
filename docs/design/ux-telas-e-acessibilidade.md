# UX — telas, fluxos e acessibilidade

## Mapa de telas
```text
Site institucional (indexável)          App (app.<dominio>, nunca indexado)
├─ Início                               ├─ Boas-vindas
├─ Como funciona                        ├─ Entrar / Criar conta (Google · e-mail e senha)   
├─ Segurança e transparência            ├─ Termos + Privacidade (primeiro acesso)    
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

## Casca do app (F01)
- **Barra superior:** wordmark "PapeAI" (placeholder até o dono escolher o logo) + troca de idioma sempre visível (um toque: "Português" / "English"). O subtítulo some abaixo de 400 px para caber.
- **Navegação:** Início · Configurações. No celular (< 640 px) fica numa **barra inferior** fixa, ao alcance do polegar (respeita a área segura do iPhone/Android). A partir de 640 px vai para a barra superior e a inferior some.
- Item ativo: `aria-current="page"` (vem do `NavLink`) **e** sinais além da cor — negrito + pílula atrás do ícone (barra inferior) ou pílula + sublinhado (barra superior).
- Ícones desenhados à mão em SVG (`app/src/ui/icons.tsx`), sempre com texto ao lado (ícone sozinho não é rótulo).
- "Pular para o conteúdo" continua como primeiro item do Tab.
- Avisos (toasts) aparecem acima da barra inferior no celular.

## Configurações (F01)
Rota `/configuracoes`. Por enquanto: **Idioma** (mesmos botões da barra superior) e **Aparência** (Igual ao aparelho · Claro · Escuro), com uma frase dizendo qual tema está ativo agora. Os outros itens do mapa de telas entram nas fases deles.

## Componentes base (F01) — `app/src/ui/`
Componentes **nativos**, sem biblioteca de UI (decisão do dono: nada de Radix/shadcn; o bloqueio de rolagem do Radix injeta `<style>`, o que quebra a CSP estrita). Eles recebem o texto **já traduzido** por props (o `ui` não importa `core`, nem o i18n).

| Componente | Comportamento acessível |
|---|---|
| `Button` | Variantes principal/secundário/discreto/perigo; tamanhos sm/md/lg, todos com alvo ≥ 44 px. `loading` mostra spinner, usa `aria-disabled` + `aria-busy` (o foco não se perde) e ignora cliques. `buttonClassName()` dá o mesmo visual a links. |
| `TextField` | Rótulo visível sempre; dica e erro ligados por `aria-describedby`; erro marca `aria-invalid` e vem com ícone + texto (não só borda vermelha). |
| `Card` | Com título vira `<section>` rotulada pelo título; nível do título configurável para manter a hierarquia da página. |
| `Dialog` | `<dialog>` nativo com `showModal()`: foco vai para dentro, o resto da página fica inerte, **Esc fecha**, rotulado pelo título (`aria-labelledby`), descrição por `aria-describedby`, botão × com rótulo, clique fora fecha (opcional), **foco volta ao botão que abriu**. Rolagem da página travada só com CSS (`html:has(dialog:modal)`). |
| `ToastProvider` / `useToast` | Regiões *live* que já existem desde o início: educada para dica/sucesso, assertiva para erro. Some sozinho em 6 s (erro fica até fechar), **pausa** com mouse ou foco em cima, botão de fechar com rótulo, ícone por tipo. Animação só com `motion-safe`. Máximo 3 na tela. |
| `Switch` | `<button role="switch" aria-checked>`; Espaço/Enter alternam; clicar no rótulo também; estado pela posição da bolinha + ✓, não só cor. |
| `Tabs` | Padrão WAI-ARIA: tabindex itinerante, ←/→ (com volta), Home/End, ativação automática; painel com `role="tabpanel"` rotulado pela aba; aba ativa em negrito com sublinhado grosso. |
| `RadioGroup` | `<fieldset>` + `<legend>` + rádios nativos (setas do teclado como o navegador define); caixa inteira clicável; nome acessível curto e descrição separada. |

Regras comuns: foco visível (anel `primary-600`, 3:1+ nos dois temas), sem `style` inline nem `innerHTML`, transições de 150–200 ms desligadas por `prefers-reduced-motion`.

**Galeria (só em desenvolvimento):** `/dev/componentes` mostra todos os componentes para testar com mouse, toque, teclado e leitor de tela nos dois temas. A rota só existe quando `import.meta.env.DEV` é verdadeiro; no build de produção ela e o código dela são removidos.

## Responsividade
- **Mobile-first** (360–430 px de largura); tablet; desktop com coluna central (máx. ~720 px) e mascote ao lado.
- Teclado virtual não pode cobrir o campo da conversa.

## Microcopy — regras
1. Frases curtas, voz ativa, segunda pessoa ("você").
2. Sem jargão técnico na interface ("chave de API" é exceção, sempre com explicação a um toque).
3. Botões dizem o que fazem ("Validar chave", não "OK").
4. Erros dizem o que aconteceu e o que fazer.
5. Nada de culpa ou pressão (ver anti-padrões em `../pedagogia/rotina-engajamento-notificacoes-emails.md`).
