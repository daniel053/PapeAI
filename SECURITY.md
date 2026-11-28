# Política de segurança do PapeAI

> **English summary:** PapeAI is a free, open-source language tutor where users bring their own API key, which stays on their device. Please report vulnerabilities **privately** through GitHub: [Report a vulnerability](https://github.com/daniel053/PapeAI/security/advisories/new) (do not open public issues). This is a solo, volunteer project: we aim to acknowledge reports within 7 days, but we cannot promise fixed timelines or rewards (no bug bounty). Reports in Portuguese or English are welcome.

## Em que estado o projeto está
O PapeAI está em desenvolvimento (fase F01: esqueleto do app web, ainda **sem** login, banco de dados ou IA). Ainda não existe versão pública para usuários finais. As promessas abaixo são **compromissos de projeto**: cada uma só vale como "garantida" quando existir o teste automatizado ou a regra técnica que a impõe, e indicamos a fase em que isso acontece. Estado atual: [`docs/00-ESTADO-ATUAL.md`](docs/00-ESTADO-ATUAL.md).

## Nossas promessas de segurança
| # | Promessa | Como é imposta | Desde |
|---|---|---|---|
| 1 | **A sua chave de API nunca vai para os nossos servidores.** Ela fica guardada cifrada no seu aparelho e é enviada somente para o provedor dono dela (ex.: `api.anthropic.com`). | Cofre único em `app/src/core/vault/`; regra de lint que bloqueia qualquer outro import; testes que procuram a chave em todo o tráfego | F03 (cofre) — a regra de lint já está ativa na F01 |
| 2 | **O navegador impõe isso:** o app só consegue se conectar a uma lista fixa de domínios. | Política de segurança de conteúdo (CSP) `connect-src` + guarda de rede com allowlist em `app/src/core/net/` | F01 (hoje: só a própria origem) |
| 3 | **Nenhum script de terceiros no app:** sem analytics, widgets ou fontes externas. | CSP sem `unsafe-inline`/`unsafe-eval` e sem domínios externos; testes em `app/src/security-headers.test.ts` | F01 |
| 4 | **Dados mínimos no servidor:** guardamos seu progresso de estudo; conversas, áudios e uso de tokens ficam no seu aparelho. | Modelo de dados e políticas de acesso documentados em `docs/dados/` e `docs/seguranca/` | F02 em diante |
| 5 | **Cada usuário só enxerga os próprios dados**, e as páginas do app não são indexadas por buscadores. | Row Level Security em todas as tabelas (F02); `robots.txt`, `X-Robots-Tag` e meta `noindex` no app (F01) | F01/F02 |

Detalhes técnicos: [`docs/seguranca/`](docs/seguranca/) (modelo de ameaças, cofre da chave, cabeçalhos e CSP).

**O que não conseguimos proteger** (e dizemos com honestidade): código malicioso que já esteja rodando dentro do app (por exemplo, uma extensão do navegador com acesso à página) pode usar a chave; um aparelho roubado e desbloqueado também. A lista completa de riscos aceitos está em [`docs/seguranca/principios-e-modelo-de-ameacas.md`](docs/seguranca/principios-e-modelo-de-ameacas.md).

## Como reportar uma vulnerabilidade (de forma privada)
1. Use o **relato privado de vulnerabilidades do GitHub**: [abrir um relato](https://github.com/daniel053/PapeAI/security/advisories/new) (ou aba *Security* do repositório → *Report a vulnerability*).
2. **Não** abra issue pública, pull request ou discussão sobre a falha antes da correção.
3. Inclua, se puder: o que encontrou, passos para reproduzir, impacto esperado e a versão/commit afetado.
4. **Nunca** envie chaves de API, senhas ou dados reais de outras pessoas no relato. Se precisar demonstrar algo com uma chave, use uma chave sua, com limite de gasto baixo, e revogue-a depois.

O arquivo [`/.well-known/security.txt`](https://www.rfc-editor.org/rfc/rfc9116) publicado no site e no app aponta para este mesmo canal.

## O que esperar de nós
O PapeAI é mantido por **uma pessoa, de forma voluntária**. Por isso, prometemos só o que conseguimos cumprir:
- **Confirmação de recebimento:** em até 7 dias, normalmente antes.
- **Avaliação inicial** (se é vulnerabilidade e qual a gravidade): assim que possível, com atualizações no próprio relato.
- **Correção:** priorizamos falhas que exponham a chave de API ou dados de usuários. Não há prazo garantido.
- **Divulgação coordenada:** combinamos com você quando publicar o aviso de segurança. Damos crédito a quem reportou, se você quiser.
- **Sem recompensa em dinheiro** (não há programa de bug bounty).

## Escopo
**Dentro do escopo:**
- O código deste repositório (app web em `app/`, site institucional em `site/`, ferramentas em `tooling/`, configuração de CI).
- As implantações oficiais do app e do site, quando existirem (os endereços oficiais serão publicados aqui e no README).
- Em especial: qualquer forma de a chave de API sair do aparelho para um destino que não seja o provedor dela; contornar a CSP; XSS; um usuário acessar dados de outro.

**Fora do escopo:**
- Serviços de terceiros que usamos (Cloudflare, GitHub, Supabase, Anthropic e outros): reporte diretamente a eles.
- Forks e cópias não oficiais do PapeAI.
- Ataques que exigem um aparelho já comprometido, desbloqueado ou com extensões maliciosas instaladas (risco aceito e documentado acima).

## O que não consideramos vulnerabilidade
- Relatórios automáticos de scanner sem demonstração de impacto real.
- Ausência de cabeçalhos ou configurações que não se aplicam a um site estático sem login (ex.: proteção contra CSRF em páginas sem formulário).
- Versões desatualizadas de bibliotecas sem um caminho de exploração no PapeAI (mas avise mesmo assim, se quiser: o Dependabot também acompanha isso).
- Negação de serviço por volume (DoS/DDoS) e testes de carga contra as implantações.
- Engenharia social, phishing ou ataques físicos contra o mantenedor ou usuários.
- O conteúdo de `robots.txt` e `security.txt` ser público (é intencional).
- Gasto de tokens na **sua própria** chave causado por você mesmo.

## Boas práticas de quem testa
- Teste só com contas e chaves **suas**. Não acesse, altere ou apague dados de outras pessoas.
- Não use testes automatizados agressivos contra as implantações oficiais; prefira rodar o projeto localmente (veja o `README.md`).
