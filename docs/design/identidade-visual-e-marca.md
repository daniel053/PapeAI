# Identidade visual e marca

## Nome
- **Nome:** PapeAI (Q-01 confirmado em 2026-11-26). Mascote: macaco-sagui (Q-02).
- **Checagens antes da F11:** domínio (`.com.br`, `.app`), busca no INPI (classes 9 — software — e 41 — educação), nomes parecidos nas lojas, nome de usuário no GitHub/redes.
- **Domínio oficial** será publicado no README e dentro do app (anti-phishing, T16): *"O PapeAI só existe em `<dominio>` e `app.<dominio>`. Nunca pedimos sua chave por e-mail, mensagem ou link."*

## Personalidade da marca
Escola amigável · segura · inteligente · honesta · um pouco atrevida (modo sem filtro). **Parece escola, não cassino**: nada de excesso de brilho, moedas, caixas de prêmio.

## Logo — direções para a F01 (escolha do dono)
| Direção | Ideia | Prós | Contras |
|---|---|---|---|
| A — Mascote no balão | Cabeça do mascote dentro de um balão de fala | Liga marca, conversa e mascote | Depende do mascote estar definido |
| B — Wordmark | "PapeAI" com o "A" formando um balão de fala | Funciona sem o mascote; legível | Menos memorável |
| C — Monograma | "P" como balão de fala (ou com tufo de orelha do sagui) | Ótimo como ícone de app | Precisa de bom desenho |

Requisitos: SVG mestre; legível a 16 px (favicon); versões colorida/monocromática/negativa; ícone adaptável do Android (camada de frente + fundo, área segura central); sem gradientes finos que somem em tamanhos pequenos.

## Paleta e temas (claro e escuro — F01)
> Evitar o verde vivo característico de apps de idioma famosos. Azul transmite confiança/segurança; coral e amarelo dão calor e alegria.

Fonte da verdade: `app/src/ui/styles.css` (bloco `@theme` = tema claro; blocos `[data-theme="dark"]` e `@media (prefers-color-scheme: dark)` = tema escuro). O nome do token descreve o **papel**, não a cor: no tema escuro `ink-900` (texto principal) fica claro e `surface-0` (fundo) fica escuro.

| Token | Papel | Claro | Escuro |
|---|---|---|---|
| `--color-primary-600` | Ações principais, links, anel de foco | `#2F4AE0` (azul escola) | `#8FA2FF` |
| `--color-primary-700` | Hover de ações principais | `#2539B8` | `#B4C1FF` |
| `--color-primary-50` | Fundos suaves, item selecionado | `#EEF1FF` | `#1E2A5A` |
| `--color-on-primary` | Texto/ícone sobre primary e error (botões cheios) | `#FFFFFF` | `#0F172A` |
| `--color-accent-500` | Destaques, mascote (**decorativo**) | `#FF6B4A` (coral) | igual |
| `--color-highlight-400` | Conquistas, XP (**decorativo**) | `#FFC93C` (amarelo) | igual |
| `--color-success-600` | Ícone de acerto, texto grande | `#1F9D63` | `#4FD18B` |
| `--color-success-700` | **Texto** de acerto | `#157A4C` (novo) | `#4FD18B` |
| `--color-warning-600` | Ícone de atenção, texto grande | `#B97800` | `#F5B83D` |
| `--color-warning-700` | **Texto** de atenção | `#8A5A00` (novo) | `#F5B83D` |
| `--color-error-600` | Ícone de erro, texto grande | `#D64545` | `#FF8A80` |
| `--color-error-700` | **Texto** de erro, botão "perigo" | `#B42318` (novo) | `#FF8A80` |
| `--color-error-800` | Hover do botão "perigo" | `#8F1C13` (novo) | `#FFB4AB` |
| `--color-ink-900` | Texto principal | `#0F172A` | `#F1F5F9` |
| `--color-ink-600` | Texto secundário | `#475569` | `#94A3B8` |
| `--color-line-200` | Divisórias e bordas decorativas | `#E2E8F0` | `#334155` |
| `--color-line-500` | Borda de controles (campo, trilho do alternador) — precisa de 3:1 | `#64748B` (novo) | `#94A3B8` |
| `--color-surface-0` | Fundo da página | `#FFFFFF` | `#0F172A` |
| `--color-surface-1` | Superfícies elevadas (cartão, diálogo, aviso, barra inferior) | `#FFFFFF` | `#1E293B` |

### Contraste (WCAG 2.x) — medido em 2026-11-26
Cálculo pela fórmula WCAG 2.x (luminância relativa sRGB) em `app/src/ui/tokens/contrast.ts`. O teste `app/src/ui/tokens/tokens.test.ts` lê os valores direto do `styles.css` e **falha** se qualquer par abaixo cair do mínimo, em qualquer tema — a tabela não fica desatualizada em silêncio. Mínimos AA: **4,5:1** texto normal; **3:1** texto grande, ícones, bordas de controles e anel de foco (WCAG 1.4.3 e 1.4.11).

| Par (frente sobre fundo) | Onde aparece | Mínimo | Claro | Escuro |
|---|---|---|---|---|
| ink-900 sobre surface-0 | texto principal na página | 4,5 | 17,85 ✅ | 16,30 ✅ |
| ink-900 sobre surface-1 | texto em cartões, diálogos, avisos | 4,5 | 17,85 ✅ | 13,35 ✅ |
| ink-900 sobre primary-50 | texto em caixa azul suave / opção selecionada | 4,5 | 15,86 ✅ | 12,50 ✅ |
| ink-600 sobre surface-0 | texto secundário | 4,5 | 7,58 ✅ | 6,96 ✅ |
| ink-600 sobre surface-1 | dicas e descrições em cartões, item inativo da barra inferior | 4,5 | 7,58 ✅ | 5,71 ✅ |
| ink-600 sobre primary-50 | descrição de opção selecionada | 4,5 | 6,73 ✅ | 5,34 ✅ |
| primary-600 sobre surface-0 | links, wordmark, item ativo do menu | 4,5 | 6,61 ✅ | 7,46 ✅ |
| primary-600 sobre surface-1 | texto de botão secundário/discreto em cartões | 4,5 | 6,61 ✅ | 6,12 ✅ |
| primary-600 sobre primary-50 | botão em hover, ícone do item ativo | 4,5 | 5,87 ✅ | 5,72 ✅ |
| on-primary sobre primary-600 | botão principal, idioma ativo | 4,5 | 6,61 ✅ | 7,46 ✅ |
| on-primary sobre primary-700 | botão principal (hover) | 4,5 | 8,91 ✅ | 10,21 ✅ |
| on-primary sobre error-700 | botão "perigo" | 4,5 | 6,57 ✅ | 7,82 ✅ |
| on-primary sobre error-800 | botão "perigo" (hover) | 4,5 | 8,96 ✅ | 10,51 ✅ |
| error-700 sobre surface-0 | mensagem de erro de campo | 4,5 | 6,57 ✅ | 7,82 ✅ |
| error-700 sobre surface-1 | mensagem de erro em cartão | 4,5 | 6,57 ✅ | 6,41 ✅ |
| success-700 sobre surface-1 | texto de acerto | 4,5 | 5,36 ✅ | 7,54 ✅ |
| warning-700 sobre surface-1 | texto de atenção | 4,5 | 5,93 ✅ | 8,22 ✅ |
| line-500 sobre surface-0 | borda do campo, trilho do alternador (desligado) | 3 | 4,76 ✅ | 6,96 ✅ |
| line-500 sobre surface-1 | borda do campo em cartão | 3 | 4,76 ✅ | 5,71 ✅ |
| primary-600 sobre surface-0 | anel de foco, trilho do alternador (ligado) | 3 | 6,61 ✅ | 7,46 ✅ |
| surface-0 sobre line-500 | bolinha do alternador (desligado) | 3 | 4,76 ✅ | 6,96 ✅ |
| on-primary sobre primary-600 | bolinha do alternador (ligado) | 3 | 6,61 ✅ | 7,46 ✅ |
| success-600 sobre surface-1 | ícone de acerto | 3 | 3,46 ✅ | 7,54 ✅ |
| warning-600 sobre surface-1 | ícone de atenção | 3 | 3,65 ✅ | 8,22 ✅ |
| error-600 sobre surface-1 | ícone de erro | 3 | 4,38 ✅ | 6,41 ✅ |

- ✅ **Pendência da F01 resolvida:** os tons `-600` de status (success 3,46 · warning 3,65 · error 4,38 sobre branco) continuam só para **ícones e texto grande**. Para **texto normal** usar os novos `-700`: success-700 5,36 · warning-700 5,93 · error-700 6,57 sobre branco.
- accent-500 (2,82 sobre branco) e highlight-400 (1,54) são **decorativos**: nunca como cor de texto. Texto sobre highlight-400 no tema claro: ink-900 (11,62 ✅). ⚠️ No tema escuro `ink-900` vira claro — quando houver texto sobre amarelo (F09, conquistas), usar uma cor de texto **fixa** escura (`#0F172A`), não `ink-900`.
- Estados desativados (opacidade 60%) são isentos de contraste pela WCAG.
- O mascote 2D tem cores fixas (é ilustração, não texto). No tema escuro a cabeça marrom tem pouco contraste com o fundo, mas orelhas e rosto claros mantêm o contorno visível. Revisar no mascote 3D (F08).

### Como o tema escuro é aplicado
- Preferência em Configurações: **Igual ao aparelho** (padrão) · **Claro** · **Escuro**. Fica salva no `localStorage` (`papeai.theme`), com `try/catch`, porque o armazenamento pode estar bloqueado (modo privado); nesse caso vale "igual ao aparelho".
- "Claro"/"Escuro" → `<html data-theme="light|dark">`. "Igual ao aparelho" → **sem** atributo, e a media query `prefers-color-scheme` decide.
- **Sem script inline** (a CSP proíbe `unsafe-inline`): quem aplica o atributo é o `ThemeProvider` (`app/src/ui/theme/`), montado na casca do app. Consequência conhecida e aceita: quem escolheu um tema **diferente** do aparelho pode ver um piscar rápido do outro tema no carregamento, até o JavaScript rodar. Quem usa "igual ao aparelho" não vê piscar, porque o CSS resolve sozinho antes do JS.
- Por que não a função CSS `light-dark()`: evitaria repetir os valores escuros, mas em navegador sem suporte (WebViews Android antigas, F10) a cor inteira seria descartada. Os dois blocos escuros repetidos são conferidos pelo teste (têm de ser idênticos).
- `color-scheme` acompanha o tema, então barras de rolagem e controles nativos também ficam escuros.

Regras: contraste AA (4,5:1 texto normal; 3:1 texto grande, ícones e bordas de controles); **cor nunca é o único sinal** (acerto/erro também com ícone e texto — essencial na avaliação de pronúncia; item ativo do menu também em negrito com pílula/sublinhado; alternador com posição da bolinha e ✓).

## Tipografia
- **Nunito** (títulos — arredondada, combina com o mascote) + **Inter** (texto) — ambas com licença OFL.
- **Self-hosted** em `app/public/fonts` (CSP e privacidade: nada de carregar de servidores externos).
- Tamanho base 16 px; escala modular; suporte a aumento de fonte do sistema.

## Forma e movimento
- Cantos arredondados (12–16 px em cartões, totalmente arredondado em botões principais), sombras suaves, espaçamento generoso.
- Ícones com traço arredondado, **desenhados à mão** como SVG simples em `app/src/ui/icons.tsx` (grade 24×24, traço 2, pontas redondas, cor = cor do texto). Sem pacote de ícones (decisão do dono na F01: componentes nativos, sem dependências novas). Se o conjunto crescer muito, reavaliar uma biblioteca MIT/ISC.
- Animações curtas (150–250 ms); respeitar `prefers-reduced-motion`.

## Tom de voz (textos do app)
| Situação | Tom | Exemplo |
|---|---|---|
| Boas-vindas | Caloroso, direto | "Oi! Eu sou o <mascote>. Vamos te deixar pronto para o que você quer fazer?" |
| Segurança | Calmo, específico, sem jargão | "Sua chave fica só neste aparelho, cifrada. Ela vai direto para a Anthropic — nós não temos como vê-la." |
| Erro | Responsável, com saída | "Não consegui falar com a IA. Sua conexão caiu? Tente de novo." |
| Progresso | Celebra esforço | "3 dias seguidos! Constância é o superpoder do idioma." |
| Custos | Transparente | "Esta lição custou cerca de US$ 0,02 na sua conta da API." |

## Mensagens do "jabá" — o que podemos e não podemos prometer
| ✅ Podemos dizer (verdade verificável) | ❌ Não podemos dizer |
|---|---|
| "Grátis: você usa sua própria chave e paga só o que consumir, direto ao provedor." | "100% grátis" sem explicar o custo da API |
| "Sua chave fica só no seu aparelho — e o código aberto mostra isso." | "100% seguro", "impossível de hackear" |
| "Mostramos exatamente o que entendemos da sua fala, palavra por palavra — e avisamos quando não temos certeza." | "Precisão perfeita", "nunca erra" |
| "Sua trilha é montada para o seu objetivo. Vá pronto para o que você quer fazer." | "Fluente em 30 dias" |
| "Professor do seu jeito: gentil, equilibrado ou sem filtro." | "Professor humano", "certificado oficial" |
| "Nível estimado com base no CEFR." | "Certificação CEFR" |

## Estrutura do site institucional (F11)
1. **Herói:** mascote + "Aprenda inglês para o que você quer fazer — grátis, com a sua chave."
2. **Três pilares:** segura (chave no aparelho), precisa (escuta palavra por palavra), guiada pelo objetivo.
3. **Como funciona:** criar conta → colar a chave → conversar com o mascote.
4. **Transparência:** código aberto, "como protegemos sua chave", política de privacidade.
5. **Perguntas frequentes:** O que é uma chave de API? Quanto custa por mês? Minha assinatura do Claude serve? (resposta honesta + créditos de API em planos Max/Ultra/Team, com link oficial) · Funciona offline? · Meus dados?
6. **Chamada:** "Começar agora" → `app.<dominio>`.
7. Rodapé: privacidade, termos, exclusão de conta, segurança, GitHub.
