# ADR-0004 — Hospedagem Cloudflare e origens separadas (site x app)
- **Status:** Aceita (2026-11-26)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** SEG-03, SEG-04, SEG-06, SEG-07, RNF-01

## Contexto
O Supabase não hospeda o frontend. Precisamos de hospedagem estática gratuita **com cabeçalhos customizados** (CSP, `X-Robots-Tag`, HSTS). O site institucional deve ser indexável; o app, nunca. O cofre da chave deve ficar numa origem sem nenhum código de terceiros.

## Opções consideradas
| Opção | Cabeçalhos customizados | Observações |
|---|---|---|
| **A. Cloudflare (Pages ou Workers com assets estáticos)** | Sim (`_headers`) | Plano gratuito generoso; DNS no mesmo lugar; preview por PR |
| B. Netlify | Sim | Boa alternativa; limites do gratuito a conferir |
| C. Vercel (Hobby) | Sim | Plano gratuito voltado a uso não comercial |
| D. GitHub Pages | **Não** (só meta tags; `frame-ancestors` não funciona por meta) | Insuficiente para a nossa CSP |

## Decisão
**Cloudflare**, com **duas origens**:
- `https://<dominio>` → site institucional (indexável).
- `https://app.<dominio>` → aplicativo (`noindex`, CSP máxima).
Até existir domínio próprio (F09), usar dois subdomínios gratuitos do provedor. Detalhe Pages x Workers decidido na F01 com a documentação atual.

## Consequências
- ➕ Armazenamento do navegador isolado por origem: nada do site enxerga o cofre do app.
- ➕ CSP e robots diferentes para cada propósito.
- ➖ Duas configurações de deploy para manter.
- ➖ Domínio próprio é recomendável para e-mail e login com aparência profissional (custo ~R$ 40/ano).

## Quando revisitar
Mudança relevante nos planos gratuitos ou necessidade de servidor próprio.

## Documentos afetados
`seguranca/seguranca-web-headers-csp-robots.md`, `arquitetura/custos-e-limites.md`, `fases/F01`, `fases/F09`.
