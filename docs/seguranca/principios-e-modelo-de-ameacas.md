# Segurança — princípios e modelo de ameaças

## Princípios
1. **Conhecimento zero da chave:** o projeto não tem como ver a chave de API do usuário — nem se quisesse.
2. **Negar por padrão:** RLS, CSP, permissões do navegador e grants começam fechados.
3. **Menor privilégio:** cada parte só acessa o que precisa (grants por coluna, chave secreta só em Edge Functions).
4. **Minimização:** não coletar o que não usamos.
5. **Defesa em profundidade:** várias camadas; nenhuma é a única barreira.
6. **Promessa verificável:** cada promessa de segurança tem um teste automatizado ou uma regra técnica que a impõe.
7. **Honestidade:** documentamos também o que **não** conseguimos proteger.
8. **Padrões seguros:** opt-in para e-mails, modo sem filtro e provedores de voz em nuvem.

## Ativos (o que protegemos)
| ID | Ativo | Onde vive | Impacto se vazar |
|---|---|---|---|
| A1 | Chave de API do usuário (e chaves de voz BYOK) | Aparelho (cofre) | **Crítico** — gasto financeiro do usuário |
| A2 | Sessão (JWT + refresh token) | Aparelho | Alto — acesso ao progresso da pessoa |
| A3 | Dados de estudo (perfil, objetivos, nível, memória) | Supabase | Médio |
| A4 | E-mail do usuário | Supabase Auth | Médio (spam, phishing) |
| A5 | Áudio e gravações | Aparelho | Alto (voz é dado pessoal) |
| A6 | Transcrições das conversas | Aparelho | Alto (podem conter vida pessoal) |
| A7 | Segredos do projeto (chave secreta do Supabase, Resend, OAuth, Cloudflare, chave de assinatura Android) | Secrets de Edge Functions/GitHub/cofre pessoal | **Crítico** |
| A8 | Contas de desenvolvedor (GitHub, Supabase, Google, Cloudflare, Anthropic, registrador do domínio) | Pessoas | **Crítico** |
| A9 | Integridade do código e das dependências | GitHub, npm | **Crítico** |
| A10 | Domínio e marca | Registrador, DNS | Alto (phishing com nosso nome) |

## Ameaças, mitigações e onde estão tratadas
| # | Ameaça | Ativo | Mitigações principais | Documento |
|---|---|---|---|---|
| T1 | XSS rouba a chave ou a sessão | A1, A2 | CSP sem `unsafe-inline`/`unsafe-eval`, zero scripts de terceiros, Trusted Types (meta), renderização segura do texto da IA, proibição de `dangerouslySetInnerHTML` | `seguranca-web-headers-csp-robots.md` |
| T2 | Dependência maliciosa ou comprometida executa código no app | A1, A9 | Poucas dependências, lockfile, revisão de atualizações, auditoria (OSV/`pnpm audit`), scripts de instalação bloqueados, verificação de existência/reputação | `../processo/git-github-e-ci.md` |
| T3 | Pacote "inventado" pela IA instalado (slopsquatting) | A9 | Regra: todo pacote novo verificado com `npm view` + reputação + aprovação | `../processo/controle-de-alucinacao-no-desenvolvimento.md` |
| T4 | Chave enviada para domínio errado (bug ou código malicioso) | A1 | Guarda de rede com allowlist de domínio **e caminho**; CSP `connect-src`; `baseURL` fixo no cliente; testes E2E de rede | `cofre-da-chave-api.md` |
| T5 | Chave aparece em logs, erros, analytics, URL | A1 | Proibição + filtro global que mascara padrões de chave + testes | `cofre-da-chave-api.md` |
| T6 | Usuário A lê/edita dados do usuário B | A3 | RLS em todas as tabelas, FKs compostas, grants por coluna, testes com 2 usuários | `supabase-rls-e-backend.md` |
| T7 | Chave secreta do Supabase vaza (repo, cliente, log) | A7 | Só em secrets de Edge Functions; gitleaks local + CI; push protection do GitHub; rotação documentada | `supabase-rls-e-backend.md` |
| T8 | Invasão de conta de desenvolvedor | A8 | MFA (preferir chave de segurança/passkey ou app autenticador) em todas as contas; e-mail de recuperação protegido | `../fases/F00-fundacao-e-decisoes.md` |
| T9 | Robôs criam contas em massa / abuso de e-mail (bombardeio de códigos) | A4 | Turnstile, limites de taxa do Auth, mensagens genéricas | `autenticacao-e-sessoes.md` |
| T10 | Enumeração de usuários (descobrir se um e-mail tem conta) | A4 | Respostas idênticas para e-mail existente/inexistente | `autenticacao-e-sessoes.md` |
| T11 | Redirecionamento aberto / roubo de código OAuth | A2 | PKCE, allowlist exata de URLs de retorno, App Links verificados no Android | `autenticacao-e-sessoes.md` |
| T12 | Clickjacking (app dentro de iframe malicioso) | A1, A2 | `frame-ancestors 'none'` | `seguranca-web-headers-csp-robots.md` |
| T13 | Aparelho roubado/desbloqueado | A1, A5, A6 | PIN opcional (web), biometria opcional (nativo), "botão de pânico" + revogar na Console | `cofre-da-chave-api.md` |
| T14 | Backup do sistema leva a chave para a nuvem | A1 | Android: excluir do backup; iOS: Keychain "ThisDeviceOnly" | `cofre-da-chave-api.md` |
| T15 | Extensões do navegador leem a página | A1 | Fora do nosso controle → aviso honesto; recomendar app nativo ou perfil sem extensões | `cofre-da-chave-api.md` |
| T16 | Phishing: site falso "PapeAI" pede a chave | A1, A10 | Domínio oficial publicado no GitHub e no app; o app **nunca** pede chave por e-mail/link | `../design/identidade-visual-e-marca.md` |
| T17 | Injeção de prompt faz o tutor exfiltrar dados (ex.: imagem com URL contendo dados) | A6 | Texto da IA sem HTML/imagens; CSP `img-src 'self' data: blob:`; links não clicáveis | `../ia/controle-de-alucinacao-do-tutor.md` |
| T18 | Custo descontrolado (laço de novas tentativas, bug que repete chamadas) | A1 (financeiro) | Limites de gasto no app, novas tentativas limitadas, orçamento por sessão | `../ia/economia-de-tokens-e-custos.md` |
| T19 | Vazamento do domínio (expiração, sequestro de DNS) | A10 | Renovação automática, MFA no registrador, bloqueio de transferência | `resposta-a-incidentes.md` |
| T20 | Dados sensíveis em texto livre (objetivos, feedback) | A3 | Limites de tamanho, aviso na UI, retenção curta, nada disso em e-mails | `privacidade-lgpd.md` |
| T21 | Edge Function abusada (exportação em massa, envio de e-mail) | A3, A4 | JWT obrigatório, limites por usuário, funções internas não invocáveis publicamente | `supabase-rls-e-backend.md` |
| T22 | Segredo colado por engano no chat com a IA ou num arquivo | A1, A7 | Regra no `CLAUDE.md`; hook que bloqueia gravação de padrões de chave; chave de desenvolvimento com limite baixo | `../processo/controle-de-alucinacao-no-desenvolvimento.md` |

## Riscos aceitos (e por quê)
| Risco | Por que aceitamos | Como reduzimos |
|---|---|---|
| Código malicioso **já rodando** dentro do app web pode usar a chave (decifrar e chamar a API) | É uma limitação de qualquer app web; cifrar no navegador não impede código na mesma origem | Impedir que ele rode (T1, T2); allowlist limita destinos; app nativo para quem quer mais proteção |
| Sessão web guardada em armazenamento do navegador | App estático sem servidor próprio para cookies `HttpOnly` | CSP forte; tokens de acesso curtos; refresh rotacionado |
| Supabase/Cloudflare/Resend como operadores | Custo zero e qualidade | Minimização; região São Paulo para o banco; contratos/DPAs dos provedores |
| O usuário pode "trapacear" a própria sequência (streak) | Não há ranking; só prejudica a si mesmo | Validação básica em função no banco |

## Revisão deste documento
- Atualizado em todo portão que adicionar ativo, fluxo de dados ou dependência relevante.
- Revisão completa na F11.
