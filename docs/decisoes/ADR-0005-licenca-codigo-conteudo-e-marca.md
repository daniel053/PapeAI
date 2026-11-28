# ADR-0005 — Licença do código, do conteúdo e da marca
- **Status:** Aceita (2026-11-26, Q-08): código sob **GPL-3.0-or-later**
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** PRD-04, MAS-08

## Contexto
O projeto será de código aberto no GitHub. O dono quer, no futuro, um "a mais" pago opcional e uma identidade própria (mascote, logo). Licença de código, de conteúdo pedagógico e de marca são coisas diferentes.

## Opções para o código
| Licença | O que permite | Quando faz sentido |
|---|---|---|
| MIT | Quase tudo, com atribuição | Máxima adoção, simplicidade |
| **Apache-2.0** | Quase tudo, com atribuição, **concessão explícita de patentes** e aviso de mudanças | Permissiva e um pouco mais protetiva que a MIT |
| GPL-3.0 | Uso livre; quem **distribuir** versão modificada (ex.: APK, código) precisa publicar o código sob GPL. Compatível com dependências MIT/Apache-2.0 | Copyleft "clássico"; **escolha do dono** |
| AGPL-3.0 | Uso livre, mas quem oferecer versão modificada pela rede precisa publicar o código | Quer impedir forks fechados hospedados |

Observação: nenhuma licença de código impede que alguém copie o app e cobre por ele; o que protege a **identidade** é a marca.

## Decisão
| O quê | Licença |
|---|---|
| Código (`app/`, `site/`, `supabase/`, `evals/` runner) | **GPL-3.0-or-later** (dono, Q-08 — escolhida GPL-3.0 em vez de AGPL-3.0). Texto oficial em `LICENSE`, baixado de gnu.org |
| Conteúdo pedagógico (`content/`) | **CC BY-SA 4.0** (compatível com listas abertas de vocabulário em CC BY-SA — ADR-0009) |
| Nome "PapeAI", logo, mascote (modelos, texturas, animações) | **Todos os direitos reservados** (aviso de marca no README; avaliar registro no INPI antes do lançamento) |
| Documentação (`docs/`) | CC BY 4.0 |

## Nota sobre GPL x AGPL (web)
Na GPL, a obrigação de publicar o código vale quando alguém **distribui** o programa. Um site é usado pela rede, sem distribuição — então quem hospedar uma versão modificada do PapeAI **como site** não precisaria publicar as mudanças. A AGPL-3.0 fecha essa brecha. O APK Android (F10) é distribuição: GPL e AGPL valem igual ali. iOS (F12): a App Store tem histórico de conflito com GPL — revisar antes.

## Consequências
- ➕ Comunidade pode usar e contribuir com o código.
- ➕ A identidade (nome e mascote) fica protegida; forks precisam de outro nome/mascote.
- ➖ Arquivos de arte ficam no repositório, mas com aviso claro de que não são livres (pasta `art/` com `LICENSE-ART.md`).

## Quando revisitar
Antes de tornar o repositório público (F11) e antes de aceitar contribuições externas de arte.

## Documentos afetados
`README.md`, `LICENSE` (F00), `design/mascote-3d.md`, `design/identidade-visual-e-marca.md`.
