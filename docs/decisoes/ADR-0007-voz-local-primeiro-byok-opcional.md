# ADR-0007 — Voz local primeiro, provedores em nuvem opcionais via BYOK
- **Status:** Proposta (decisão final após o benchmark da F07)
- **Data:** 2026-11-26
- **Decisor:** dono do projeto · **Proposta por:** IA
- **Requisitos relacionados:** VOZ-01..13, TUT-12, PRIV-05

## Contexto
O tutor precisa falar e o app precisa ouvir **com precisão** (sem "arredondar" palavras), coletando entonação e ritmo. O projeto é gratuito. A API de mensagens do Claude não processa áudio (confirmar na F07). O dono mencionou serviços pagos de voz/transcrição como possível enriquecimento.

## Opções consideradas
| Opção | Custo | Privacidade | Precisão para ensino |
|---|---|---|---|
| Reconhecimento do navegador | Grátis | Áudio pode ir ao fabricante | Baixa (arredonda) |
| **Modelos locais** (transcrição + fonemas) | Grátis | Áudio fica no aparelho | Boa se calibrada; depende do aparelho |
| **BYOK em nuvem** (ex.: avaliação de pronúncia de provedores) | Cota grátis/pago pelo usuário | Áudio vai ao provedor do usuário | Alta |
| Provedor pago pelo projeto | Custo nosso | Áudio vai a terceiros | Alta — **inviável** (projeto grátis) |

## Decisão (proposta)
1. **Local primeiro:** vozes do sistema/modelos locais para TTS; transcrição literal e avaliação de fonemas no aparelho.
2. **BYOK opcional** para quem quiser mais qualidade, com a chave do próprio usuário no cofre e consentimento específico.
3. **Claude só explica** as evidências medidas (`SpeechEvidence`).
4. A escolha exata de modelos/provedores sai do **benchmark** (spike da F07) e atualiza esta ADR para "Aceita".

## Consequências
- ➕ Grátis e privado por padrão.
- ➕ Precisão medida antes de prometer.
- ➖ Downloads de modelos e desempenho variam por aparelho.
- ➖ CSP precisará de `wasm-unsafe-eval` (e talvez COEP) para modelos em WebAssembly.

## Quando revisitar
Após o benchmark (obrigatório) e sempre que surgir modelo/serviço que mude o equilíbrio custo × precisão × privacidade.

## Documentos afetados
`voz/*`, `seguranca/seguranca-web-headers-csp-robots.md`, `seguranca/cofre-da-chave-api.md`, `fases/F07`.
