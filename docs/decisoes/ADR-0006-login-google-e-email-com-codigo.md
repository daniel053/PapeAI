# ADR-0006 — Login com Google + e-mail com código (sem senha)
- **Status:** Proposta
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** CON-01..04, CON-10, CON-12, SEG-07

## Contexto
O dono pediu os padrões da web, como "Entrar com Google". Queremos o mínimo de dados e de riscos.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **Google (OAuth + PKCE)** | Padrão, rápido, sem senha para guardar | Sem domínio próprio, a tela do Google mostra o domínio do Supabase |
| **E-mail com código de 6 dígitos** | Funciona para quem não usa Google; sem senha | Depende de boa entrega de e-mail (SMTP próprio na F09) |
| E-mail + senha | Familiar | Senhas fracas/vazadas, recuperação de senha, mais superfície |
| Link mágico | Sem senha | Problemas quando o link abre em outro navegador/app; código é mais robusto no celular |
| Apple | Exigido/indicado em certos casos no iOS | Só relevante na F12 |

## Decisão (proposta)
- **Google** — web: redirecionamento OAuth com PKCE (sem scripts do Google na origem do app); Android: login nativo → `signInWithIdToken`.
- **E-mail com código** como alternativa.
- **Sem senhas.** Turnstile anti-robô; mensagens anti-enumeração.

## Consequências
- ➕ Nada de senha para vazar, esquecer ou proteger.
- ➕ Nenhum código de terceiros na origem do cofre.
- ➖ Entrega de e-mail vira item crítico (SPF/DKIM/DMARC na F09).
- ➖ iOS (F12) exigirá reavaliar as opções conforme as diretrizes da App Store.

## Quando revisitar
Ao levar o app para iOS ou se usuários pedirem outros provedores.

## Documentos afetados
`seguranca/autenticacao-e-sessoes.md`, `fases/F02`, `fases/F10`.
