# Identidade visual e marca

## Nome
- **Nome de trabalho:** PapeAI (Q-01 — confirmar significado: papo? papear? papagaio?).
- **Checagens antes da F11:** domínio (`.com.br`, `.app`), busca no INPI (classes 9 — software — e 41 — educação), nomes parecidos nas lojas, nome de usuário no GitHub/redes.
- **Domínio oficial** será publicado no README e dentro do app (anti-phishing, T16): *"O PapeAI só existe em `<dominio>` e `app.<dominio>`. Nunca pedimos sua chave por e-mail, mensagem ou link."*

## Personalidade da marca
Escola amigável · segura · inteligente · honesta · um pouco atrevida (modo sem filtro). **Parece escola, não cassino**: nada de excesso de brilho, moedas, caixas de prêmio.

## Logo — direções para a F01 (escolha do dono)
| Direção | Ideia | Prós | Contras |
|---|---|---|---|
| A — Mascote no balão | Cabeça do mascote dentro de um balão de fala | Liga marca, conversa e mascote | Depende do mascote estar definido |
| B — Wordmark | "PapeAI" com o "A" formando um balão de fala | Funciona sem o mascote; legível | Menos memorável |
| C — Monograma | "P" como balão de fala (ou bico, se papagaio) | Ótimo como ícone de app | Precisa de bom desenho |

Requisitos: SVG mestre; legível a 16 px (favicon); versões colorida/monocromática/negativa; ícone adaptável do Android (camada de frente + fundo, área segura central); sem gradientes finos que somem em tamanhos pequenos.

## Paleta (proposta inicial — validar contraste na F01)
> Evitar o verde vivo característico de apps de idioma famosos. Azul transmite confiança/segurança; coral e amarelo dão calor e alegria.

| Token | Uso | Valor inicial |
|---|---|---|
| `--color-primary-600` | Ações principais, links | `#2F4AE0` (azul escola) |
| `--color-primary-50` | Fundos suaves | `#EEF1FF` |
| `--color-accent-500` | Destaques, mascote | `#FF6B4A` (coral) |
| `--color-highlight-400` | Conquistas, XP | `#FFC93C` (amarelo) |
| `--color-success-600` | Acerto | `#1F9D63` |
| `--color-warning-600` | Atenção / incerto | `#B97800` |
| `--color-error-600` | Erro | `#D64545` |
| `--color-ink-900` | Texto principal | `#0F172A` |
| `--color-ink-600` | Texto secundário | `#475569` |
| `--color-line-200` | Bordas | `#E2E8F0` |
| `--color-surface-0` | Fundo | `#FFFFFF` / tema escuro na F01 |

Regras: contraste AA (4,5:1 texto normal; 3:1 texto grande e ícones); **cor nunca é o único sinal** (acerto/erro também com ícone e texto — essencial na avaliação de pronúncia).

## Tipografia
- **Nunito** (títulos — arredondada, combina com o mascote) + **Inter** (texto) — ambas com licença OFL.
- **Self-hosted** em `app/public/fonts` (CSP e privacidade: nada de carregar de servidores externos).
- Tamanho base 16 px; escala modular; suporte a aumento de fonte do sistema.

## Forma e movimento
- Cantos arredondados (12–16 px em cartões, totalmente arredondado em botões principais), sombras suaves, espaçamento generoso.
- Ícones com traço arredondado (biblioteca com licença MIT/ISC, definida na F01).
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
