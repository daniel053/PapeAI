# ADR-0005 — Licença do código, do conteúdo e da marca
- **Status:** Proposta (escolha do dono — Q-08)
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
| AGPL-3.0 | Uso livre, mas quem oferecer versão modificada pela rede precisa publicar o código | Quer impedir forks fechados hospedados |

Observação: nenhuma licença de código impede que alguém copie o app e cobre por ele; o que protege a **identidade** é a marca.

## Decisão (proposta)
| O quê | Licença proposta |
|---|---|
| Código (`app/`, `site/`, `supabase/`, `evals/` runner) | **Apache-2.0** |
| Conteúdo pedagógico (`content/`) | **CC BY-SA 4.0** (compatível com listas abertas de vocabulário em CC BY-SA — ADR-0009) |
| Nome "PapeAI", logo, mascote (modelos, texturas, animações) | **Todos os direitos reservados** (aviso de marca no README; avaliar registro no INPI antes do lançamento) |
| Documentação (`docs/`) | CC BY 4.0 |

## Consequências
- ➕ Comunidade pode usar e contribuir com o código.
- ➕ A identidade (nome e mascote) fica protegida; forks precisam de outro nome/mascote.
- ➖ Arquivos de arte ficam no repositório, mas com aviso claro de que não são livres (pasta `art/` com `LICENSE-ART.md`).

## Quando revisitar
Antes de tornar o repositório público (F11) e antes de aceitar contribuições externas de arte.

## Documentos afetados
`README.md`, `LICENSE` (F00), `design/mascote-3d.md`, `design/identidade-visual-e-marca.md`.
