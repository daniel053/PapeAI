# F11 — Endurecimento, conformidade e lançamento

> **Status:** ⏳ Não iniciada · **Marco ao final: M4 — Lançamento público**

## Objetivo
Revisar tudo antes de abrir para o público: segurança (modelo de ameaças, OWASP), privacidade (política, termos, LGPD), acessibilidade, desempenho, plano de incidentes; publicar o site institucional final, tornar o repositório público e liberar o app na Play.

## Documentos desta fase
1. `../seguranca/` (todos), em especial `../seguranca/checklist-de-seguranca-por-fase.md` (F11) e `../seguranca/resposta-a-incidentes.md`
2. `../seguranca/privacidade-lgpd.md` (documentos a produzir)
3. `../design/identidade-visual-e-marca.md` (site institucional e "jabá" honesto)
4. `../processo/testes-e-qualidade.md`
5. `../03-IDEIA-ORIGINAL-E-RASTREABILIDADE.md` (revisar antes de tornar o repositório público)
6. `../arquitetura/custos-e-limites.md` (reconfirmar limites)

## Pré-requisitos
- F10 aprovada. Teste fechado da Play concluído (14 dias com ≥ 12 testadores). Q-19, Q-22, Q-23 respondidas.

## Escopo
**Inclui:** revisão completa de segurança e privacidade, documentos legais finais, rotinas de retenção (limpezas agendadas; inatividade se aprovada), decisão sobre relatórios de erro sem PII, auditoria de acessibilidade, desempenho, site institucional final, README bilíngue, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, repositório público, publicação na Play em produção, comunicado de lançamento.
**Não inclui:** novas funcionalidades.

## Passos
### A. Segurança
- [ ] Revisão completa do modelo de ameaças (novos ativos/fluxos desde a F00).
- [ ] Percorrer OWASP ASVS nível 1 (web) e MASVS (mobile); registrar achados e correções.
- [ ] Revisão de dependências (auditoria limpa ou justificada), Actions, segredos (rotação preventiva se fizer sentido).
- [ ] `/security-review` geral + revisão manual dos pontos críticos (cofre, rede, RLS, funções).
- [ ] Plano de incidentes com contatos/tabela de contas preenchidos.

### B. Privacidade e legal
- [ ] Política de Privacidade e Termos finais (pt-BR, linguagem simples, versionados); aviso sobre IA; uso aceitável (modo sem filtro).
- [ ] Confirmar as referências da ANPD marcadas "confirmar" (incidentes, agentes de pequeno porte, transferência internacional).
- [ ] Canal de privacidade publicado (PRIV-08).
- [ ] Rotinas de retenção (`pg_cron`) e, se aprovada, exclusão por inatividade com aviso.
- [ ] Ideal: revisão por profissional de direito.

### C. Qualidade
- [ ] Auditoria de acessibilidade (axe + TalkBack + teclado) — sem violações graves.
- [ ] Desempenho: Lighthouse, tamanho do bundle, tempo do mascote, consumo de bateria.
- [ ] Decisão sobre relatórios de erro (nenhum x serviço com filtro de PII) → ADR.

### D. Lançamento
- [ ] Site institucional final (estrutura em `../design/identidade-visual-e-marca.md`), FAQ honesto (assinatura x chave, custos).
- [ ] Revisar textos pessoais em `docs/03-...` e qualquer dado pessoal no repositório; então tornar o repositório público.
- [ ] README bilíngue, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, templates de issue/PR.
- [ ] Liberar a produção na Play; publicar o domínio oficial no README e no app (anti-phishing).
- [ ] Comunicado de lançamento (canais do dono).

## Segurança nesta fase
Seção F11 do checklist (a mais completa).

## Testes e verificações
- Relatório consolidado: segurança, privacidade, acessibilidade, desempenho — com evidências.
- Teste de restauração/recuperação de incidentes simulado (ex.: rotação de segredo).

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Publicar dados pessoais no repositório público | Revisão explícita antes de mudar a visibilidade |
| Promessas exageradas no site | Tabela "podemos/não podemos dizer" |
| Pico de uso estourar planos gratuitos | Alertas e plano B documentados |

## O que você vai aprender
- Como é uma revisão de segurança de ponta a ponta.
- O básico de documentos de privacidade e de lançamento de produto.

## Portão de aprovação F11 (M4)
**Critérios:**
- [ ] Todos os checklists da F11 completos, com evidências.
- [ ] Documentos legais publicados e linkados no app, no site e na Play.
- [ ] Repositório público revisado; site final no ar; app em produção na Play.

**Roteiro de teste do dono (40 min):**
1. Leia a política de privacidade e os termos como se fosse um usuário.
2. Percorra o site institucional e o FAQ no celular.
3. Instale o app pela Play (versão de produção) e faça o fluxo completo do zero.
4. Revise o repositório como visitante (aba anônima do navegador).
5. Diga **"aprovado F11"** — lançamento! 🚀
