# F03 — Cofre da chave (BYOK) e conexão com o Claude

> **Status:** ⏳ Não iniciada

## Objetivo
O usuário entende o que é a chave, cola, valida **sem gastar tokens**, a chave fica **cifrada no aparelho** e só vai para `api.anthropic.com`. Um chat simples (ainda sem persona) prova a conexão com streaming. Painel de consumo e limites de gasto funcionando. Testes automatizados **provam** a promessa.

## Documentos desta fase
1. `../seguranca/cofre-da-chave-api.md` (principal)
2. `../ia/arquitetura-do-tutor.md` (seções de fatos da API, rotas, erros)
3. `../ia/economia-de-tokens-e-custos.md`
4. `../dados/armazenamento-local.md`
5. `../seguranca/principios-e-modelo-de-ameacas.md`
6. Skill `claude-api` (README TypeScript, streaming, erros, structured outputs) — **carregar antes de codar**
7. `../seguranca/checklist-de-seguranca-por-fase.md` (F03)

## Pré-requisitos
- F02 aprovada. ADR-0003 aceita. ADR-0008 proposta (perfis existem; padrão decidido na F04).

## Escopo
**Inclui:** `core/vault` (web), `core/net` com allowlist de domínio+caminho, CSP atualizada, `core/llm` com `@anthropic-ai/sdk`, validação via `/v1/models`, teste opcional de créditos, telas educativas e de chave, remover chave + "botão de pânico", `core/usage` (registro local, preços versionados, painel, orçamentos), perfis de qualidade, chat simples com streaming, tela "Como protegemos sua chave", testes de prova.
**Não inclui:** persona do tutor, correções, memória (F04).

## Passos
### A. Cofre
- [ ] Implementar contrato do cofre (sem `getKey`) com AES-GCM e chave não exportável; banco `papeai-vault` separado; entradas por usuário.
- [ ] PIN opcional (PBKDF2 — confirmar recomendação atual de iterações) com chave decifrada só em memória.
- [ ] Remover chave (apaga de verdade).
- [ ] Testes unitários do cofre (lista em `../seguranca/cofre-da-chave-api.md`).

### B. Rede e CSP
- [ ] Allowlist: `api.anthropic.com` (`/v1/messages`, `/v1/messages/count_tokens`, `/v1/models`) + Supabase.
- [ ] CSP `connect-src` atualizada nas duas configurações (dev/prod).
- [ ] Filtro de mascaramento de chaves para logs/erros + testes.

### C. Cliente do Claude
- [ ] Carregar a skill `claude-api`; confirmar a forma atual de streaming, structured outputs, classes de erro e `dangerouslyAllowBrowser`.
- [ ] `baseURL` fixo; `maxRetries` padrão (2); timeouts por rota.
- [ ] `config/models.ts` + checagem de disponibilidade via `/v1/models`.
- [ ] Tratamento de `stop_reason` (`refusal`, `max_tokens`) e de erros tipados (tabela em `../ia/arquitetura-do-tutor.md`).
- [ ] **Saldo de créditos insuficiente** (pedido do dono): mensagem clara na tela ("sua chave está sem créditos na Claude Console") com link para a página de cobrança da Console; nunca falha silenciosa. Formato exato do erro confirmado na doc oficial da API.
- [ ] Avaliar e decidir (registrar na ADR-0008) o uso do fallback no servidor para Sonnet/Opus.

### D. Telas
- [ ] Educativa (3 cartões) + link para criar chave + instrução de limite de gasto + nota sobre créditos de planos (link oficial).
- [ ] Colar/validar/testar créditos/limpar área de transferência.
- [ ] Configurações → Chave: impressão digital, trocar, remover, revogar na Console.
- [ ] "Como protegemos sua chave" (com links para o código).

### E. Consumo e limites
- [ ] `usage_ledger` local; `config/pricing.ts` com fonte e data.
- [ ] Painel (hoje/semana/mês, por recurso e por modelo, exportar CSV).
- [ ] Orçamentos diário/mensal com aviso em 80% e bloqueio em 100%.
- [ ] Seleção de perfil de qualidade com custo estimado.

### F. Chat simples
- [ ] Tela de teste com streaming (será substituída pelo tutor na F04).

### G. Testes de prova (E2E)
- [ ] `e2e.key-only-to-anthropic` com chave falsa e API simulada.
- [ ] `e2e.csp-blocks`.
- [ ] `lint.vault-imports` na CI.

## Segurança nesta fase
Seção F03 do checklist — é a fase mais sensível do projeto. Rodar `/security-review` no PR.

## Testes e verificações
- Todos os testes da seção "Testes que provam a promessa" verdes (saída no relatório).
- Demonstração gravada/descrita: aba Rede do DevTools mostrando a chave só em `api.anthropic.com`.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Usar API "de memória" e errar parâmetros | Skill `claude-api` + docs oficiais antes de codar |
| Laços de novas tentativas multiplicando custo | Só as novas tentativas do SDK; testes |
| Exposição da chave em mensagens de erro | Filtro global + teste |
| Usuário confundir assinatura com chave | Tela educativa com linguagem simples e link oficial |

## O que você vai aprender
- Como funciona uma chamada de API e o que é streaming.
- O que é criptografia simétrica (AES) e por que a chave "não exportável" ajuda.
- Como ler a aba Rede do navegador para verificar para onde os dados vão.

## Portão de aprovação F03
**Critérios:**
- [ ] Fluxo completo da chave funcionando (educativa → colar → validar → usar → remover).
- [ ] Chat simples com streaming usando a chave de dev do dono.
- [ ] Painel de consumo e orçamentos funcionando.
- [ ] Testes de prova verdes; `/security-review` sem achados abertos de alta severidade.
- [ ] Tela de transparência aprovada pelo dono.

**Roteiro de teste do dono (20 min):**
1. Siga a tela educativa e cole sua **chave de desenvolvimento** (no app, nunca no chat da IA).
2. Valide; faça 3 perguntas no chat simples; veja o custo no painel.
3. Abra DevTools → Rede; filtre por "supabase" e confirme que a chave não aparece; filtre por "anthropic" e veja que ela só aparece ali.
4. Defina um orçamento diário baixíssimo e veja o bloqueio funcionar.
5. Remova a chave e confirme que o chat pede a chave de novo.
6. Diga **"aprovado F03"** ou o que precisa mudar.
