# ADR-0001 — Web primeiro (PWA) + Capacitor para mobile
- **Status:** Aceita (2026-11-26, Q-05 — aprovada após explicação detalhada da stack e das alternativas)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** PRD-03, RNF-02, RNF-06, RNF-10

## Contexto
O dono quer começar simples ("talvez até um site"), aprender mobile aos poucos, gerar APK com facilidade e depois migrar sem reescrever. O app precisa de 3D (mascote), possivelmente modelos de voz no aparelho (WebAssembly) e armazenamento seguro da chave no celular.

## Opções consideradas
| Opção | Prós | Contras |
|---|---|---|
| **A. React + Vite como PWA → Capacitor** | Uma base de código; tecnologias web (mais fácil de aprender); 3D com three.js é de primeira classe; WebAssembly disponível no navegador e no WebView; teste no celular desde o dia 1 pelo navegador; Capacitor gera o projeto Android com o mesmo código | Sensação um pouco menos "nativa"; WebView tem particularidades (testar cedo) |
| B. Expo / React Native (+ web) | Mais nativo; Expo Go facilita testes | 3D e WebAssembly mais difíceis (o motor JS do React Native não roda WASM como o navegador); duas "versões" de comportamento web x nativo |
| C. Flutter | Bom desempenho, uma base | Linguagem nova (Dart); 3D e web menos maduros para este caso |
| D. Nativo (Kotlin) | Máximo desempenho | Começa sem web; mais lento para aprender e iterar |

## Decisão
**Opção A.** Desenvolver como PWA (F01–F09) e empacotar para Android com Capacitor (F10). Diferenças de plataforma isoladas em `app/src/platform/` (adaptadores).

## Consequências
- ➕ Você testa no celular pelo navegador já na F01, sem gerar APK.
- ➕ Migração para Android = trocar adaptadores, não reescrever telas.
- ➖ Na web, a chave fica no armazenamento do navegador (cifrada), mais fraco que o Keystore; o app nativo resolve isso na F10.
- ➖ Recursos de voz no WebView precisam ser validados cedo (F07).

## Pontos de atenção discutidos com o dono (2026-11-26)
1. Na web a chave fica mais exposta que no Keystore → CSP estrita, zero scripts de terceiros, cifragem, testes E2E de rede; Android (F10) usa Keystore.
2. Particularidades do WebView (microfone, áudio após gesto, teclado) → spike de voz na F07.
3. Desempenho de 3D + voz em celular intermediário → metas de FPS e reserva 2D (F08).
4. Sensação menos "nativa" → aceitável para um tutor de conversa.
5. Saída de emergência: lógica fora das telas (`core/`), o que facilita migrar para React Native se as metas falharem.

## Quando revisitar
Se, no spike da F07 ou na F10, o WebView não atingir as metas de desempenho (mascote < 30 FPS, voz lenta demais) em celular intermediário.

## Documentos afetados
`arquitetura/stack-tecnologica.md`, `arquitetura/estrutura-de-pastas-e-modulos.md`, `fases/F01`, `fases/F10`.
