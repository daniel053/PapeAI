# Portões de aprovação

## O que é um portão
O ponto final de cada fase. A IA prova que os critérios foram atendidos; o dono testa e decide. **Sem a frase "aprovado F0X", a próxima fase não começa.**

## Tipos de critério
| Tipo | Exemplo | Evidência aceita |
|---|---|---|
| Funcional | "Login com Google funciona" | Roteiro de teste do dono + E2E verde |
| Segurança | "RLS cobre todas as tabelas" | Saída dos testes + Security Advisor |
| Qualidade | "Acessibilidade sem violações graves" | Relatório do axe |
| Documentação | "Modelo de dados atualizado" | Link/diff do documento |
| Decisão | "ADR-0008 aceita" | ADR com status e data |

## Modelo de relatório do portão (a IA gera em `docs/fases/relatorios/FNN-relatorio.md`)
```markdown
# Relatório do portão — FNN <nome>
**Data:** AAAA-MM-DD · **Commit/PR:** <link> · **Ambiente testado:** dev | prod | aparelho

## Resumo (3 linhas)
O que foi entregue e o estado geral.

## Critérios do portão
| Critério | Status | Evidência |
|---|---|---|
| ... | ✅ / ⚠️ / ❌ | comando + saída, link do teste, print descrito |

## Checklist de segurança da fase
(cópia da seção FNN de seguranca/checklist-de-seguranca-por-fase.md, marcada)
Resumo do /security-review: ...

## Testes
- Unitários: N passaram / 0 falharam
- E2E: ...
- Evals (se houver): tabela + custo gasto

## Pendências conhecidas
| Pendência | Impacto | Proposta |
|---|---|---|

## Riscos novos ou alterados
...

## Decisões tomadas nesta fase
ADRs criadas/alteradas.

## Roteiro de teste do dono
(cópia do roteiro do documento da fase, com URLs reais)

## Próxima fase (prévia)
O que começa se aprovado.
```

## Respostas possíveis
| Resposta do dono | O que a IA faz |
|---|---|
| **"aprovado F0X"** | Marca ✅ em `00-ESTADO-ATUAL.md` com a data; com autorização, cria a tag `fase-NN-aprovada`; abre a próxima fase |
| **"aprovado com ressalvas F0X: …"** | Marca ⚠️; cada ressalva vira tarefa **obrigatória** no início da próxima fase |
| **"reprovado: …"** | Marca ❌; cada motivo vira tarefa de correção; novo relatório quando corrigido |

## Registro no estado (formato)
```markdown
| F03 | Cofre da chave (BYOK) e conexão com o Claude | ✅ aprovada | 2027-02-10 | fase-03-aprovada |
```

## Regras
1. Critério não atendido não é "esquecido": vira pendência explícita no relatório.
2. Evidência é concreta (saída de comando, resultado de teste) — "deve funcionar" não é evidência.
3. O roteiro do dono usa as URLs e telas reais, passo a passo.
4. Mudança de escopo durante a fase → ADR ou backlog, nunca silenciosa.
