# Autenticação, usuários e sessões

> **Dois tipos de "token" — não confundir:**
> - **Token de IA:** unidade de cobrança da IA (custo). → `../ia/economia-de-tokens-e-custos.md`
> - **Token de sessão (JWT):** prova de que você está logado. → este documento.
> Bônus de segurança do desenho BYOK: **mesmo que alguém invada a conta de um usuário, não consegue a chave de API dele**, porque ela não está no servidor.

## Métodos de login (ADR-0006)
| Método | Web | Android (F10) | Observações |
|---|---|---|---|
| **Google** | OAuth com PKCE por redirecionamento (`signInWithOAuth`) — nenhum script do Google dentro do app | Login nativo do Google → `signInWithIdToken` (com nonce) | Escopos mínimos: `openid`, `email`, `profile` |
| **E-mail com código** | `signInWithOtp` + `verifyOtp` (código de 6 dígitos) | Igual | Sem senha: nada para vazar ou esquecer |
| Apple | — | — | Avaliar na F12 (iOS) conforme diretrizes da App Store |

> As chamadas exatas do `supabase-js` são confirmadas na documentação oficial na F02 (regra anti-alucinação).

### Por que redirecionamento (e não o botão "One Tap" do Google) na web?
O "One Tap" exige carregar um script do Google **dentro da origem do app**, onde vive o cofre — violaria SEG-07. O redirecionamento não executa código de terceiros no app. Custo: sem domínio próprio, a tela do Google mostra o domínio `*.supabase.co`. Solução futura: domínio próprio + verificação de marca no Google (F09/F11).

## Configuração do Supabase Auth (checklist da F02)
- [ ] **Site URL** = URL do app (dev e prod separados).
- [ ] **Redirect URLs**: lista exata (sem curingas em produção): `https://app.<dominio>/auth/callback`, `http://localhost:<porta>/auth/callback` só no projeto de dev.
- [ ] Confirmação de e-mail **ativada**.
- [ ] Troca de e-mail segura (confirmação nos dois endereços) **ativada**.
- [ ] Validade do código por e-mail curta (ex.: 10 min) — confirmar opções disponíveis.
- [ ] Limites de taxa revisados (envio de e-mail, verificação, refresh).
- [ ] **CAPTCHA (Cloudflare Turnstile)** ativado para cadastro, login e envio de código.
- [ ] Rotação de refresh token **ativada** (com detecção de reuso).
- [ ] Expiração do JWT de acesso: padrão (~1 h) ou menor.
- [ ] Modelos de e-mail do Auth traduzidos para pt-BR, com a marca (F02/F09).
- [ ] SMTP próprio (Resend) configurado antes de produção — o SMTP padrão do Supabase é para testes, com limites baixos (confirmar).
- [ ] Provedores não usados **desativados**.

## Configuração do Google Cloud (F02)
- [ ] Projeto Google Cloud dedicado ao PapeAI; MFA na conta.
- [ ] Tela de consentimento OAuth "Externa", nome do app, e-mail de suporte, links de privacidade/termos (podem ser provisórios no dev).
- [ ] Escopos: só `openid`, `email`, `profile`.
- [ ] Cliente OAuth "Aplicativo da Web" com URI de redirecionamento do Supabase; cliente Android separado na F10 (SHA-1/SHA-256 do certificado).
- [ ] Enquanto em "Testing", só usuários de teste cadastrados conseguem entrar (limite de usuários de teste — confirmar).
- [ ] Segredo do cliente OAuth **só** no painel do Supabase — nunca no repositório.

## Cadastro e primeiro acesso
1. Login (Google ou código) → Supabase cria o usuário → gatilho cria `profiles` e `notification_preferences`.
2. Tela obrigatória: aceitar **Termos** e **Privacidade** (versões atuais) e confirmar **18+** → gravar em `consent_records` + `profiles.age_confirmed_at`.
3. Sem esse passo, o app não libera nada (guard de rota + verificação no carregamento).
4. Depois: tela educativa da chave (F03) → onboarding (F05).

## Sessões (tokens JWT)
| Item | Regra |
|---|---|
| Token de acesso | Curto (~1 h); renovado automaticamente pelo `supabase-js` |
| Refresh token | Rotacionado a cada uso; reuso indevido invalida a sessão |
| Onde fica | Web: armazenamento do navegador (avaliar adaptador IndexedDB na F02). Nativo: armazenamento seguro |
| Sair | `signOut()` local (este aparelho) e opção "sair de todos os aparelhos" (escopo global) |
| Excluir conta | Invalida todas as sessões |
| Logs | Tokens **nunca** são logados nem exibidos |
| Autorização | Feita pelo **banco** (RLS lê o `sub` do JWT). O app nunca decide sozinho o que o usuário pode ver |
| Metadados | `user_metadata` é editável pelo próprio usuário → **nunca** usar em políticas de autorização. Papéis (se um dia existirem) ficam em `app_metadata`, que só o servidor altera |

## Proteções contra abuso
| Ameaça | Proteção |
|---|---|
| Enumeração de contas | Mesma resposta para e-mail com ou sem conta ("Se o e-mail estiver correto, você receberá um código") |
| Robôs | Turnstile + limites de taxa |
| Bombardeio de códigos para um e-mail | Limite por e-mail e por IP (Auth) + intervalo mínimo entre envios na UI |
| Força bruta no código | Expiração curta + limite de tentativas (Auth) |
| Sequestro do retorno OAuth | PKCE + allowlist exata de redirect |
| Ação sensível com sessão roubada | Excluir conta e trocar e-mail exigem confirmação por código enviado ao e-mail |

## Mensagens de erro (sem revelar detalhes internos)
| Situação | Mensagem ao usuário |
|---|---|
| Código errado/expirado | "Código inválido ou expirado. Peça um novo." |
| Muitas tentativas | "Muitas tentativas. Tente de novo em alguns minutos." |
| Falha de rede | "Sem conexão. Verifique sua internet." |
| Erro inesperado | "Algo deu errado. Tente de novo." (detalhe técnico só no console de desenvolvimento, sem dados pessoais) |

## Administração
- Não existe painel de administração dentro do app.
- Administração pelo painel do Supabase, com **MFA** e o mínimo de membros na organização.
- Nenhuma coluna do tipo `is_admin` editável pelo usuário.

## Edge Functions e autenticação
- Funções chamadas pelo app exigem JWT válido; a função identifica o usuário pelo token, nunca por um `user_id` enviado no corpo.
- Funções internas (envio de e-mail, tarefas agendadas) **não** são invocáveis pelo público (segredo interno ou verificação de papel de serviço).
- Detalhes: `supabase-rls-e-backend.md`.
