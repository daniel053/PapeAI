# ADR-0003 — BYOK: chave somente no dispositivo, chamada direta ao provedor
- **Status:** Aceita (2026-11-26)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** PRD-02, BYOK-01..16, PRIV-10, SEG-03, SEG-07

## Contexto
O app é grátis porque o usuário usa a **própria** chave de IA. A ideia original pedia que a chave ficasse 100% no celular, sem vazar para nenhuma outra plataforma, e que isso estivesse expresso no código aberto. Também era a intenção atender "quem tem assinatura do Claude Code".

Fatos verificados (2026-11-26): a Anthropic não permite que apps de terceiros usem o login/tokens de planos de consumo (Free/Pro/Max) nem ofereçam "login com claude.ai" sem aprovação prévia; o caminho oficial é a chave de API da Console. Planos Max, Ultra e Team incluem créditos mensais de API (regras atuais). A API aceita chamadas diretas do navegador com o cabeçalho de acesso direto habilitado (no SDK: `dangerouslyAllowBrowser`).

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **A. Chave só no aparelho, chamada direta à API** | Servidor nunca vê a chave; custo zero de infraestrutura de IA; promessa verificável no código | Chave precisa ser colada em cada aparelho; na web, o risco principal é XSS (mitigado por CSP e zero terceiros) |
| B. Proxy no nosso servidor guardando chaves cifradas | Esconde a chave do navegador | **Nosso servidor veria as chaves** (viola a promessa), custo, responsabilidade enorme |
| C. Login com assinatura do Claude (OAuth do claude.ai) | Seria o sonho da ideia original | **Não permitido** pelas regras da Anthropic para terceiros |

## Decisão
**Opção A**, com: cofre (`core/vault`) como único guardião, allowlist de domínio+caminho, CSP `connect-src`, testes automatizados de rede, tela educativa explicando assinatura × chave, e créditos de API de planos com link oficial.

## Consequências
- ➕ A promessa central é técnica e verificável, não só um texto.
- ➕ Mesmo uma invasão do nosso banco não expõe chaves.
- ➖ Público inicial menor (quem tem chave de API ou créditos de plano) → mitigação: onboarding didático, custo baixo visível, multi-provedor no futuro (BL-01).
- ➖ Multi-aparelho exige colar a chave em cada um (por design).

## Quando revisitar
Se a Anthropic oferecer um mecanismo oficial e permitido de autorização para apps de terceiros, ou ao adicionar outros provedores (F12.5).

## Documentos afetados
`seguranca/cofre-da-chave-api.md`, `01-VISAO-DO-PRODUTO.md`, `ia/arquitetura-do-tutor.md`, `fases/F03`.
