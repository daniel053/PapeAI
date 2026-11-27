# Checklist de segurança por fase

> Usado no relatório de cada portão. Item não aplicável → marcar "N/A" com justificativa. Item não atendido → vira pendência explícita (não some).
> Em todo portão também: rodar `/security-review` no que mudou e anexar o resumo.

## Itens permanentes (todos os portões a partir da F01)
- [ ] Nenhum segredo no repositório (gitleaks local + CI verdes).
- [ ] Nenhuma dependência nova sem a ficha de verificação (`../arquitetura/stack-tecnologica.md`).
- [ ] Auditoria de dependências sem vulnerabilidade alta/crítica aberta (ou justificativa + prazo).
- [ ] CI verde (lint, tipos, testes, build).
- [ ] Nenhuma promessa de segurança nova sem teste ou regra técnica que a sustente.
- [ ] Modelo de ameaças atualizado se surgiu ativo/fluxo novo.

## F00 — Fundação e decisões
- [ ] MFA ativo: GitHub, conta Google, Supabase, Cloudflare, Claude Console, e-mail principal (e registrador/Resend quando existirem).
- [ ] E-mail de recuperação das contas é seguro (com MFA).
- [ ] Organização/workspace na Claude Console só para o PapeAI, chave de dev com limite de gasto baixo.
- [ ] Repositório fora do OneDrive (Q-12) ou riscos aceitos por escrito.
- [ ] GitHub: secret scanning + push protection + Dependabot alerts + relato privado de vulnerabilidades ativados.

## F01 — Esqueleto web e segurança base
- [ ] CSP do app conforme `seguranca-web-headers-csp-robots.md`, testada em produção (`curl -I`).
- [ ] Cabeçalhos de segurança com nota máxima em scanner público (ou justificativa).
- [ ] `robots.txt` (app: `Disallow: /`), `X-Robots-Tag` e meta `noindex` no app.
- [ ] `security.txt` publicado; `SECURITY.md` no repositório.
- [ ] Origens separadas: site x app.
- [ ] Zero scripts/fontes de terceiros no app.
- [ ] Regras de lint: proibição de `dangerouslySetInnerHTML`/`eval`; fronteiras de módulos.
- [ ] Branch `main` protegida; Actions com permissões mínimas e fixadas por SHA.
- [ ] Hook local anti-segredo (gitleaks) instalado; hook do Claude Code anti-padrão-de-chave (SEG-17) avaliado. *(hook pronto em `tooling/git-hooks/pre-commit`, ligar com `pnpm hooks:install`; proposta SEG-17 em `../processo/git-github-e-ci.md`, aguarda aprovação)*

## F02 — Contas e usuários
- [ ] RLS em todas as tabelas; teste de RLS com 2 usuários + anônimo cobrindo todas as tabelas.
- [ ] FKs compostas; grants por coluna em `profiles`.
- [ ] Funções `security definer` com `search_path = ''` e checagem do chamador.
- [ ] Security Advisor sem erros.
- [ ] Chave secreta do Supabase só em secrets de função.
- [ ] Auth: PKCE, redirect allowlist exata, confirmação de e-mail, Turnstile, limites de taxa, rotação de refresh.
- [ ] Mensagens anti-enumeração verificadas manualmente.
- [ ] Exclusão de conta apaga tudo (teste) e exige confirmação.
- [ ] Exportação de dados com limite de uso.

## F03 — Cofre BYOK e cliente Claude
- [ ] Todos os testes da seção "Testes que provam a promessa" de `cofre-da-chave-api.md` passando.
- [ ] E2E de rede: chave só em requisições para `api.anthropic.com`.
- [ ] Filtro de mascaramento de chave em logs/erros testado.
- [ ] Allowlist de domínio + caminho ativa.
- [ ] Limites de gasto e novas tentativas limitadas (sem laços).
- [ ] Tela de transparência "Como protegemos sua chave" revisada pelo dono.

## F04 — Tutor em texto
- [ ] Texto da IA renderizado sem HTML/imagens; links não clicáveis.
- [ ] Validação de schema + verificação de citações literais.
- [ ] Modo sem filtro com consentimento registrado e regras de limite testadas (evals).
- [ ] Transcrições só locais; memória do tutor visível/editável.

## F05 — Onboarding e nivelamento
- [ ] Campos livres com limite de tamanho e aviso de dados sensíveis.
- [ ] Transcrição do nivelamento só local; servidor guarda só resultado + citações curtas.

## F06 — Trilha
- [ ] `record_activity` valida posse e limites (teste).
- [ ] Conteúdo gerado validado antes de exibir; cache local isolado por usuário.

## F07 — Voz
- [ ] Permissão de microfone pedida só no momento de uso, com explicação.
- [ ] Áudio nunca enviado ao nosso servidor (teste E2E de rede com gravação).
- [ ] Provedor de voz BYOK: chave no cofre, domínio fixo, consentimento específico.
- [ ] Ajustes de CSP (`wasm-unsafe-eval`, provedores) registrados em ADR.
- [ ] Modelos baixados de fonte fixa, com verificação de integridade (hash) quando possível.

## F08 — Mascote 3D
- [ ] Assets 3D servidos do próprio domínio; nenhum carregamento externo.
- [ ] Licença dos assets registrada (ADR-0005).

## F09 — Engajamento
- [ ] Funções de e-mail não invocáveis publicamente.
- [ ] Descadastro por token HMAC; um clique; idempotente.
- [ ] SPF, DKIM, DMARC configurados e verificados.
- [ ] E-mails sem dados sensíveis; sem pixels de rastreamento.
- [ ] Opt-in registrado em `consent_records`.

## F10 — Android
- [ ] Chave no Keystore; excluída do backup; `FLAG_SECURE` na tela da chave.
- [ ] App Links verificados (`assetlinks.json`); sem esquemas customizados para OAuth, se possível.
- [ ] Chave de upload/assinatura guardada com backup offline seguro; Play App Signing ativo.
- [ ] Formulário de "Segurança dos dados" da Play coerente com este documento.
- [ ] Página web de exclusão de conta publicada.

## F11 — Endurecimento e lançamento
- [ ] Revisão completa do modelo de ameaças.
- [ ] Checklist OWASP (ASVS nível 1 para web; MASVS para mobile) percorrido.
- [ ] Revisão de todos os textos públicos (inclui `03-IDEIA-ORIGINAL...` antes de o repositório ficar público).
- [ ] Plano de incidentes revisado e contatos preenchidos.
- [ ] Política de privacidade e termos publicados e versionados.

## F12 — Evolução
- [ ] Compras validadas no servidor; `entitlements` só gravado por função.
- [ ] Novos provedores de IA seguem a mesma regra do cofre (domínio fixo + testes de rede).
