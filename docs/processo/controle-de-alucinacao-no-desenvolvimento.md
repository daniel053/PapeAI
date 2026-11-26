# Controle de alucinação no desenvolvimento (regras para a IA)

> IAs de programação às vezes "lembram" de funções que não existem, opções de configuração de versões antigas, limites de planos que mudaram, ou dizem que algo funciona sem ter rodado. Este documento define como evitamos isso. (As alucinações do **tutor** no produto estão em `../ia/controle-de-alucinacao-do-tutor.md`.)

## Hierarquia de fontes de verdade
1. **O que roda:** código do repositório, saída de comandos, testes.
2. **Os documentos do projeto:** `00-ESTADO-ATUAL.md`, documento da fase, ADRs, modelo de dados.
3. **Documentação oficial atual** (site oficial, README do pacote, skill `claude-api` para a API do Claude).
4. **Memória do modelo** — **nunca** suficiente sozinha para API, comando, configuração, preço ou limite.

## Regras
1. **Verifique antes de usar.** Primeira vez usando uma biblioteca/serviço/comando na fase → consultar a documentação oficial atual e citar a fonte no PR ou no doc.
2. **Pacotes existem?** Antes de instalar: `npm view <nome> name version repository license` (saída colada) + ficha de dependência (`../arquitetura/stack-tecnologica.md`). Nome parecido com pacote famoso, pouquíssimos downloads ou criado há pouco → **recusar** (*slopsquatting*: criminosos publicam pacotes com nomes que IAs costumam inventar).
3. **Versões:** sempre a estável atual verificada; registrar a adotada.
4. **Nada de "deve funcionar":** só afirmar que algo funciona com evidência (comando executado + saída, teste verde, demo).
5. **Suposições marcadas:** quando não houver como verificar na hora, escrever `[SUPOSIÇÃO]` e criar tarefa de verificação.
6. **Fatos externos com data e fonte:** preços, limites, regras de loja, leis → registrar "verificado em AAAA-MM-DD: <link>".
7. **Escopo:** não criar arquivos, telas ou funcionalidades fora da tarefa aprovada.
8. **Releitura:** em sessões longas, reler o documento antes de editar algo que depende dele (não confiar no que "lembra" da conversa).
9. **Erros reais primeiro:** quando algo falhar, ler a mensagem de erro inteira e agir sobre ela, em vez de adivinhar.
10. **Sem segredos:** nunca pedir, aceitar, repetir ou gravar chaves/senhas reais; testes usam valores falsos.
11. **Diga o que não sabe:** "não tenho certeza; vou verificar" é sempre melhor que inventar.

## Onde este projeto tem mais risco de alucinação
| Área | Exemplos de erro provável | Como verificar |
|---|---|---|
| API do Claude | Usar `temperature`, prefill, `budget_tokens`, nomes de modelo antigos ou com sufixo de data | Skill `claude-api` + docs oficiais |
| Supabase | Opções de Auth renomeadas, sistema de chaves novo x antigo, grants explícitos, comandos da CLI | Docs oficiais na F02 |
| Capacitor/plugins | Nome de plugin de armazenamento seguro, API de login nativo | npm + repositório do plugin na F10 |
| Cloudflare | Sintaxe do `_headers`, Pages x Workers | Docs oficiais na F01 |
| three.js/R3F | APIs que mudaram entre versões | Docs da versão instalada (F08) |
| Modelos de voz | Nomes de modelos, licenças, tamanhos | Página oficial do modelo (F07) |
| Regras de lojas e Android | Testadores, verificação de desenvolvedor, formulários | Ajuda oficial da Play (F10) |
| LGPD/ANPD | Números de artigos/resoluções, prazos | Texto oficial (F11) |
| Planos gratuitos | Limites de uso | Página de preços oficial |

## Sinais de alerta para o dono (e perguntas de verificação)
| Sinal | Pergunte |
|---|---|
| "Isso deve funcionar" | "Mostre o comando que você rodou e a saída." |
| Pacote novo que você nunca ouviu falar | "Mostre o `npm view` e a ficha da dependência." |
| Número (preço, limite, prazo) | "Qual a fonte e a data?" |
| Arquivos/telas que você não pediu | "Isso estava no plano da sessão?" |
| Teste "pulado" ou desativado | "Por que foi desativado? Qual a tarefa para reativar?" |
| Mudança em segurança sem comentário | "Isso altera alguma promessa do README?" |

## Evidências no relatório do portão
Cada critério marcado ✅ aponta para algo verificável: saída de comando, nome do teste, link de PR/commit, print descrito. Ver `portoes-de-aprovacao.md`.
