## O quê
<!-- Resumo curto da mudança. Uma tarefa (ou grupo pequeno de tarefas) da fase atual. -->

## Por quê
<!-- Fase (F0X), IDs de requisito (ex.: SEG-17, BYOK-05) e ADR relacionados. -->

## Como testar
<!-- Passos para o dono reproduzir. Cole a evidência: comando executado + saída, teste, print descrito. -->

## Checklist

### Evidência
- [ ] CI verde (`lint`, `format`, `typecheck`, `unit`, `build`, `audit`, `secrets`, CodeQL)
- [ ] Testes adicionados/atualizados e passando (unitário; E2E quando existir e a mudança tocar um fluxo)
- [ ] Evidência colada acima (nada de "deve funcionar")

### Documentação
- [ ] `docs/00-ESTADO-ATUAL.md` atualizado
- [ ] Decisão nova/alterada → ADR em `docs/decisoes/`
- [ ] Schema alterado → migração + `docs/dados/modelo-de-dados.md` + `docs/dados/changelog-do-schema.md` (mesmo PR)
- [ ] Dependência nova → ficha em `docs/arquitetura/stack-tecnologica.md` aprovada pelo dono
- [ ] Fatos externos (preços, limites, APIs) com fonte e data

### Segurança
- [ ] Nenhum segredo, chave ou dado pessoal real no código, testes, logs ou docs (chaves de teste com o marcador `FAKE`)
- [ ] A chave do usuário só sai do aparelho direto para o provedor dono dela; só `core/vault` lê/grava e só `core/llm` usa
- [ ] CSP e fronteiras de módulos respeitadas (sem afrouxar `_headers` sem ADR)
- [ ] Tabela nova/alterada tem RLS com política explícita (F02+)
- [ ] `/security-review` rodado se tocou área sensível (vault, llm, net, auth, headers, CI)

### Escopo
- [ ] Só a fase atual; ideias novas foram para `docs/06-BACKLOG-DE-IDEIAS.md`
- [ ] Textos de interface via i18n (pt-BR e en); acessibilidade básica (rótulos, foco, contraste)
- [ ] Commits em inglês (Conventional Commits)

## Riscos
<!-- O que pode quebrar, como desfazer, e o que não foi verificado. -->
