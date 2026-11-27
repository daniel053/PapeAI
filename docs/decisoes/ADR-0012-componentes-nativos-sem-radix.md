# ADR-0012 — Componentes de interface nativos, sem shadcn/Radix
- **Status:** Aceita (2026-11-26)
- **Data:** 2026-11-26 (proposta e aceita na mesma sessão)
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Substitui:** a linha "Componentes: shadcn/ui sobre Radix" de `arquitetura/stack-tecnologica.md` (não havia ADR para ela)
- **Requisitos relacionados:** segurança da web (CSP estrita, risco #2 em `00-ESTADO-ATUAL.md`), acessibilidade (`design/ux-telas-e-acessibilidade.md`)

## Contexto
A F01 pede componentes base acessíveis (botão, campo, cartão, diálogo, aviso, alternador, abas) e uma **CSP sem `unsafe-inline`** na origem do app, que é onde fica o cofre da chave. O documento de stack previa shadcn/ui sobre Radix.

Na verificação dos pacotes (2026-11-26, `npm view @radix-ui/react-dialog dependencies`), o diálogo do Radix depende de `react-remove-scroll`, que trava a rolagem **injetando uma tag `<style>`** na página. Com `style-src 'self'` sem `unsafe-inline`, o navegador bloqueia essa tag: o recurso falha e o console registra violações da CSP. Para usar o Radix, teríamos que afrouxar a política de estilos ou conviver com erros.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **Componentes nativos (HTML + ARIA), sem pacote** | Zero dependências novas; compatível com a CSP estrita; o código fica todo no repositório; `<dialog>` nativo já prende o foco e deixa o fundo inerte | Mais código nosso para manter e testar; precisa de cuidado com acessibilidade (padrões WAI-ARIA de abas, alternador e aviso) |
| shadcn/ui + Radix, como no documento | Componentes prontos, maduros e acessíveis | Exigiria `style-src 'unsafe-inline'` (ou um nonce, que um site estático não consegue gerar) ou conviver com violações; várias dependências de runtime novas |
| Outra biblioteca sem estilos injetados (ex.: React Aria) | Acessibilidade forte | Dependência grande; precisaria verificar CSP e licença; sem necessidade agora |

## Decisão
Componentes base **nativos**, em `app/src/ui/`, usando elementos HTML acessíveis (`<button>`, `<dialog>` com `showModal()`, `<button role="switch">`, abas no padrão WAI-ARIA, região `aria-live` para avisos), estilizados só com classes Tailwind (sem `style` embutido). Nenhuma dependência nova.

## Consequências
- ➕ A CSP do app continua sem `unsafe-inline` em scripts **e** estilos.
- ➕ Menos código de terceiros na origem do cofre (menor superfície de ataque de cadeia de suprimentos).
- ➖ Cada componente precisa de revisão de acessibilidade e de testes; os testes com navegador real (Playwright + axe) ainda não foram aprovados e ficam pendentes.
- ➖ Componentes complexos que surgirem depois (combobox, menu, data) podem exigir rever esta decisão.

## Quando revisitar
- Quando um componente complexo for necessário (ex.: combobox de busca) e o custo de fazê-lo à mão passar do razoável.
- Se o Radix (ou outra biblioteca) deixar de injetar `<style>` ou passar a aceitar nonce/folhas de estilo estáticas.

## Documentos afetados (atualizar se esta ADR mudar)
`arquitetura/stack-tecnologica.md` (linha "Componentes"), `fases/F01-esqueleto-web-e-seguranca-base.md`, `design/ux-telas-e-acessibilidade.md`, `seguranca/seguranca-web-headers-csp-robots.md`.
