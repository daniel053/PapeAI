# F12 — Evolução: premium opcional, novos idiomas e iOS

> **Status:** ⏳ Não iniciada · **M5 — Evolução contínua**

## Objetivo
Evoluir o produto depois do lançamento **sem quebrar as promessas** (grátis no núcleo, chave só no aparelho, privacidade). Cada item abaixo vira uma **subfase** (`F12.1`, `F12.2`, …) com o mesmo formato e seu próprio portão.

## Documentos desta fase
1. `../06-BACKLOG-DE-IDEIAS.md`
2. `../pedagogia/idiomas-extensiveis.md`
3. `../dados/modelo-de-dados.md` (`entitlements`)
4. `../seguranca/cofre-da-chave-api.md` (novos provedores)
5. `../processo/portoes-de-aprovacao.md`

## Pré-requisitos
- F11 aprovada. Feedback do lançamento triado.

## Candidatas a subfases (o dono prioriza)
| Subfase | Tema | Pontos-chave | Origem |
|---|---|---|---|
| F12.1 | **"Um a mais" premium opcional** | Cosméticos do mascote (roupas, acessórios, paletas), vozes extras, pacotes temáticos especiais; **nunca** bloquear aprendizado; compras pela loja (Google Play Billing para itens digitais no Android); validação no servidor (`validate-purchase`) → `entitlements`; transparência | I-16, PRD-09, Q-17 |
| F12.2 | **Apoio voluntário** | GitHub Sponsors / Pix, sem vantagens que prejudiquem quem não apoia | Q-17 |
| F12.3 | **Novos idiomas** | Checklist de `../pedagogia/idiomas-extensiveis.md` (espanhol é candidato natural) | I-17 |
| F12.4 | **iOS** | Capacitor iOS, conta Apple (anual), Keychain, diretrizes de login da App Store (opção de login com privacidade equivalente), revisão da App Store | PRD-03, BL-07 |
| F12.5 | **Outros provedores de IA (BYOK)** | Mesma regra do cofre (domínio fixo, testes de rede), aviso claro de privacidade de cada provedor (alguns planos gratuitos usam dados para treino) | BL-01 |
| F12.6 | **Geração em lote mais barata** | Lições da semana via Batch API (desconto), agendadas quando o app abre | BL-10 |
| F12.7 | **Conteúdo da comunidade** | Pacotes temáticos enviados por colaboradores, com revisão e licença CC BY-SA | BL-05 |
| F12.8 | **Prática para exames** | Formatos de IELTS/TOEFL como prática, sem promessa oficial | BL-09, OBJ-08 |
| F12.9 | **Sincronização cifrada de conversas** | Opt-in, cifra ponta a ponta com chave do usuário | BL-04 |

## Regras para qualquer subfase
1. Começa com uma ADR (o quê, por quê, alternativas, impacto em privacidade/segurança/custo).
2. Mantém as promessas do README; se alguma mudar, isso é comunicado **antes** aos usuários.
3. Passa pelo checklist de segurança e pelo portão como as demais fases.

## Portão de aprovação (por subfase)
Critérios definidos na ADR da subfase + checklist de segurança + roteiro de teste do dono.
