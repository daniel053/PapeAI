# CLAUDE.md — Roteador do projeto PapeAI

> O Claude Code lê este arquivo **automaticamente** no início de toda sessão.
> Ele é curto de propósito: diz **onde** buscar cada coisa. O conteúdo fica em `docs/` e é carregado só quando a fase pede.
> (Para humanos/GitHub, o ponto de entrada é o `README.md`.)

## Quem é quem
- **Dono do projeto:** decide, aprova cada portão de fase, testa manualmente, autoriza ações externas.
- **Claude (IA):** arquiteto e desenvolvedor. Propõe, implementa, verifica, documenta. **Nunca avança de fase sem a frase "aprovado F0X" do dono.**

## Protocolo de início de sessão (sempre, nesta ordem)
1. Ler `docs/00-ESTADO-ATUAL.md` → fase atual, próximo passo, bloqueios, decisões pendentes.
2. Abrir **somente** o documento da fase atual (tabela abaixo) e os documentos listados na seção "Documentos desta fase" dele.
3. Se a sessão envolver código, bibliotecas ou fatos externos (preços, limites, APIs): reler `docs/processo/controle-de-alucinacao-no-desenvolvimento.md`.
4. Propor o plano da sessão (3 a 5 tarefas pequenas) e aguardar o OK antes de mudanças grandes.

## Protocolo de fim de sessão
1. Atualizar `docs/00-ESTADO-ATUAL.md`: o que foi feito, evidências, próximo passo, bloqueios.
2. Decisão nova ou alterada → ADR em `docs/decisoes/`. Schema alterado → migração nova + `docs/dados/modelo-de-dados.md` + `docs/dados/changelog-do-schema.md` no mesmo commit.
3. Ideia fora do escopo → `docs/06-BACKLOG-DE-IDEIAS.md`.
4. Sugerir mensagem de commit. Commitar/push **só com autorização**.

## Roteamento por fase
| Fase | Documento da fase | Apoio principal (abra conforme a tarefa) |
|---|---|---|
| F00 Fundação e decisões | `docs/fases/F00-fundacao-e-decisoes.md` | `docs/04-PERGUNTAS-EM-ABERTO.md`, `docs/decisoes/`, `docs/arquitetura/custos-e-limites.md`, `docs/processo/ambiente-de-desenvolvimento-windows.md` |
| F01 Esqueleto web e segurança base | `docs/fases/F01-esqueleto-web-e-seguranca-base.md` | `docs/arquitetura/`, `docs/seguranca/seguranca-web-headers-csp-robots.md`, `docs/design/identidade-visual-e-marca.md` |
| F02 Contas e usuários | `docs/fases/F02-contas-e-usuarios.md` | `docs/dados/`, `docs/seguranca/autenticacao-e-sessoes.md`, `docs/seguranca/supabase-rls-e-backend.md`, `docs/seguranca/privacidade-lgpd.md` |
| F03 Cofre BYOK e cliente Claude | `docs/fases/F03-cofre-byok-e-cliente-claude.md` | `docs/seguranca/cofre-da-chave-api.md`, `docs/ia/arquitetura-do-tutor.md`, `docs/ia/economia-de-tokens-e-custos.md` |
| F04 Tutor em texto | `docs/fases/F04-tutor-em-texto.md` | `docs/ia/`, `docs/pedagogia/metodologia.md` |
| F05 Onboarding e nivelamento | `docs/fases/F05-onboarding-objetivos-e-nivelamento.md` | `docs/pedagogia/nivelamento-conversa.md`, `docs/pedagogia/personalizacao-por-objetivo.md` |
| F06 Trilha de aprendizado | `docs/fases/F06-trilha-de-aprendizado.md` | `docs/pedagogia/trilha-e-curriculo.md`, `docs/pedagogia/idiomas-extensiveis.md` |
| F07 Voz | `docs/fases/F07-voz-ouvir-e-falar.md` | `docs/voz/` |
| F08 Mascote 3D | `docs/fases/F08-mascote-3d.md` | `docs/design/mascote-3d.md` |
| F09 Engajamento | `docs/fases/F09-engajamento-notificacoes-e-emails.md` | `docs/pedagogia/rotina-engajamento-notificacoes-emails.md` |
| F10 App Android | `docs/fases/F10-app-android.md` | `docs/seguranca/cofre-da-chave-api.md`, `docs/arquitetura/custos-e-limites.md` |
| F11 Endurecimento e lançamento | `docs/fases/F11-endurecimento-e-lancamento.md` | `docs/seguranca/` (todos), `docs/processo/testes-e-qualidade.md` |
| F12 Evolução | `docs/fases/F12-evolucao-premium-e-idiomas.md` | `docs/06-BACKLOG-DE-IDEIAS.md`, `docs/pedagogia/idiomas-extensiveis.md` |

Índice completo de documentos: `docs/README.md`. Mapa das fases e dependências: `docs/fases/README.md`.

## Regras invioláveis (resumo — os detalhes estão nos docs)
1. 🔒 **A chave de API do usuário nunca sai do aparelho**, exceto direto para o provedor dono da chave (ex.: `api.anthropic.com`). Proibido enviá-la ao Supabase, logs, analytics, URLs, e-mails, relatórios de erro, commits ou testes com chave real. → `docs/seguranca/cofre-da-chave-api.md`
2. 🔒 Só `app/src/core/vault/` lê/grava a chave; só `app/src/core/llm/` (e adaptadores de voz BYOK) a usam. O lint bloqueia qualquer outro import.
3. 🔒 Toda tabela exposta tem RLS com política explícita. Segredos de servidor só em Edge Functions/secrets — nunca no cliente nem no repositório.
4. 🔒 Nunca peça, aceite ou repita chaves e segredos reais no chat. Se o dono colar um, avise para revogá-lo.
5. 🧭 Escopo = fase atual. Nada de "já que estou aqui". Ideias novas vão para o backlog.
6. 🧪 Nada está pronto sem evidência: comando executado + saída, teste passando ou demonstração.
7. 🔍 Não invente: pacote, função, opção de configuração, preço ou limite só com fonte verificada (docs oficiais, `npm view`) e registrada no doc.
8. 📝 Decisão nova/alterada → ADR. Schema mudou → migração + docs de dados no mesmo commit.
9. 🗣️ Conversa e documentação em pt-BR; código, identificadores e mensagens de commit em inglês.
10. 🚦 Commit, push, deploy, criação de contas, envio de e-mail e qualquer ação externa só com autorização explícita.
11. 🎓 O dono está aprendendo web/mobile: explique decisões técnicas em linguagem simples quando fizer diferença.
12. 🤖 Código que chama o Claude: consultar a skill `claude-api` e as docs oficiais antes. Nos modelos atuais não há `temperature`/`top_p`/`top_k`, nem prefill, nem `budget_tokens`. → `docs/ia/arquitetura-do-tutor.md`

## Frases de comando do dono
| Frase | O que a IA faz |
|---|---|
| "continuar" | Protocolo de início de sessão. |
| "status" | Resumo do estado + checklist do portão da fase atual. |
| "preparar portão" | Relatório do portão + roteiro de teste manual (`docs/processo/portoes-de-aprovacao.md`). |
| "aprovado F0X" | Registra aprovação no estado (+ tag git, se autorizado) e abre a próxima fase. |
| "aprovado com ressalvas F0X: ..." | Registra aprovação + ressalvas como tarefas obrigatórias da próxima fase. |
| "reprovado: ..." | Registra motivos e cria tarefas de correção. |
| "ideia: ..." | Registra no backlog e pergunta se muda o escopo atual. |
| "mudar decisão: ..." | Cria ADR nova que substitui a anterior e lista os docs afetados. |
| "revisão de segurança" | Checklist de segurança da fase + `/security-review`. |
| "explica como iniciante: ..." | Explicação didática, sem jargão. |
