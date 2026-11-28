# ADR-0006 — Login com Google + e-mail e senha
- **Status:** Aceita (2026-11-26, Q-06)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** CON-01..04, CON-10, CON-12, SEG-07
- **Histórico:** a proposta original era Google + e-mail com código, sem senha. O dono preferiu e-mail e senha, para dar versatilidade e não criar barreira.

## Contexto
O dono quer os padrões que todo usuário já conhece: "Entrar com Google" e "e-mail e senha". O público principal são devs (projeto de portfólio), que esperam essas duas opções.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **Google (OAuth + PKCE)** | Padrão, rápido, sem senha para guardar | Sem domínio próprio, a tela do Google mostra o domínio do Supabase |
| **E-mail + senha** | Familiar; funciona para quem não usa Google; não depende de receber e-mail a cada login | Senhas fracas ou vazadas; precisa de fluxo de "esqueci a senha"; mais superfície de ataque |
| E-mail com código (OTP) | Sem senha | Depende de e-mail a cada login — preterido pelo dono |
| Link mágico | Sem senha | Problemas quando o link abre em outro navegador/app |
| Apple | Exigido/indicado em certos casos no iOS | Só relevante na F12 |

## Decisão
- **Google** — web: redirecionamento OAuth com PKCE (sem scripts do Google na origem do app); Android: login nativo → `signInWithIdToken`.
- **E-mail + senha** pelo Supabase Auth (a senha nunca é guardada por nós: o Supabase guarda só o hash).
  - Confirmação de e-mail obrigatória antes do primeiro acesso.
  - "Esqueci a senha" por e-mail.
  - Política de senha: mínimo de 8 caracteres e bloqueio de senhas vazadas, **se o plano do Supabase permitir** (verificar na F02; se não, checagem de tamanho + lista de senhas comuns no cliente).
  - Mensagens anti-enumeração ("se o e-mail existir, enviamos instruções").
- Turnstile anti-robô no cadastro, no login e no "esqueci a senha"; limites de tentativas do Supabase revisados.
- Mesmo e-mail via Google e via senha → comportamento de vinculação de contas do Supabase verificado na F02.

## Consequências
- ➕ Duas portas de entrada conhecidas, sem barreira para o usuário.
- ➖ Senha é mais uma coisa a proteger: entram fluxo de recuperação, política de senha e testes de força bruta no checklist da F02.
- ➖ Confirmação e recuperação dependem de envio de e-mail. **A verificar na F02:** limites do e-mail padrão do Supabase; se forem baixos demais, um SMTP próprio (ex.: Resend) pode ser necessário antes da F09.
- ➕ Nenhum código de terceiros na origem do cofre (mantido).
- ➖ iOS (F12) exigirá reavaliar as opções conforme as diretrizes da App Store.

## Quando revisitar
Ao levar o app para iOS, se usuários pedirem outros provedores, ou se houver ataques de força bruta/credenciais vazadas.

## Documentos afetados
`seguranca/autenticacao-e-sessoes.md`, `02-REQUISITOS.md` (CON-02), `01-VISAO-DO-PRODUTO.md`, `arquitetura/visao-geral.md`, `fases/F02`, `fases/F10`.
