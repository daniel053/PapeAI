# Definição de pronto (DoD)

## Uma tarefa está pronta quando
- [ ] Faz o que a tarefa descreve (e só isso — sem extras não combinados).
- [ ] Compila; lint e verificação de tipos sem erros.
- [ ] Testes relevantes criados/atualizados e passando (unitário; E2E se mexe em fluxo).
- [ ] Nenhum segredo, chave ou dado pessoal real no código, testes, logs ou docs.
- [ ] Textos de interface via i18n; acessibilidade básica (rótulos, foco, contraste).
- [ ] Respeita as fronteiras de módulos (lint) e a CSP.
- [ ] Documentos afetados atualizados (dados, ADR, stack, estado).
- [ ] A IA mostrou a evidência (comando + saída, teste, ou tela para o dono ver).

## Um PR está pronto quando
- [ ] Todas as tarefas dele estão prontas.
- [ ] CI verde.
- [ ] Descrição com: o quê, por quê, como testar, requisitos (IDs) e riscos.
- [ ] Migração de banco (se houver) segue o checklist de `../dados/evolucao-e-migracoes.md`.
- [ ] Dependência nova (se houver) tem ficha de verificação aprovada.
- [ ] `/code-review` (e `/security-review` quando tocar áreas sensíveis) sem achados graves abertos.

## Uma fase está pronta quando
- [ ] Todos os critérios do portão atendidos (ou pendências aceitas pelo dono).
- [ ] Checklist de segurança da fase completo.
- [ ] Relatório do portão gerado.
- [ ] Dono testou pelo roteiro e respondeu "aprovado".
- [ ] `00-ESTADO-ATUAL.md` atualizado.
