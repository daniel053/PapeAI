# ADR-0009 — Conteúdo curado no repositório + geração por IA validada
- **Status:** Proposta
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** TRI-01..06, OBJ-04, TUT-13, A-14

## Contexto
A trilha vai do Pre-A1 ao C2 e é personalizada por objetivo. Gerar tudo com IA é barato de construir, mas arrisca erros e inconsistência; curar tudo à mão é inviável para um dev solo.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| Tudo gerado por IA | Rápido | Alucinação, inconsistência, custo por usuário |
| Tudo curado à mão | Qualidade | Inviável em escala |
| **Híbrido** | Esqueleto confiável + variedade e personalização | Exige validador e processo de curadoria |

## Decisão (proposta)
1. **Curado e versionado em `content/`:** programa por nível, listas de vocabulário, banco de perguntas do nivelamento, erros típicos de brasileiros, pacotes temáticos (com fatos culturais com fonte), lições de reserva.
2. **Gerado pela IA dentro de restrições:** atividades das lições, a partir de um `LessonSpec` montado pelo código, com **validador** antes de exibir e cache local.
3. **Status de curadoria** nos pacotes (`draft_ai` → `reviewed` → `published`); só os revisados aparecem para usuários.
4. **Licenças:** usar apenas fontes com licença compatível e registrá-las. Candidatas a verificar na F06: listas da família NGSL (CC BY-SA), lista CEFR-J (verificar termos), dicionário de pronúncia CMUdict (licença permissiva — verificar). **Evitar** listas proprietárias (ex.: listas comerciais de vocabulário por nível) sem licença. Ferramentas GPL (ex.: alguns sintetizadores/fonemizadores) só com análise de compatibilidade antes de embutir.

## Consequências
- ➕ Base confiável e revisável por qualquer pessoa (código aberto).
- ➕ Personalização sem perder controle.
- ➖ Trabalho de curadoria contínuo (trilha paralela de conteúdo).
- ➖ Conteúdo derivado de fontes CC BY-SA herda a licença (por isso `content/` é CC BY-SA — ADR-0005).

## Quando revisitar
Ao abrir contribuições da comunidade (F12.7) ou ao adicionar idiomas.

## Documentos afetados
`pedagogia/trilha-e-curriculo.md`, `pedagogia/personalizacao-por-objetivo.md`, `pedagogia/idiomas-extensiveis.md`, `fases/F06`.
