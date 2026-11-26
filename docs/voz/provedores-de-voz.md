# Provedores de voz (TTS e reconhecimento)

> Decisão final na F07, com o benchmark (ADR-0007). Este documento lista as opções e os critérios. Preços e cotas: confirmar na época — mudam com frequência.

## Critérios
1. **Custo para o usuário** (grátis primeiro; BYOK opcional).
2. **Privacidade** (no aparelho > nuvem do provedor escolhido pelo usuário).
3. **Precisão para ensino** (literal, fonemas, confiança).
4. **Plataformas** (navegador, WebView do Android, iOS).
5. **Licença** (embutir modelos/dicionários exige licença compatível).
6. **Tamanho e desempenho** em celular intermediário.

## Síntese de fala (o tutor falando)
| Opção | Custo | Privacidade | Qualidade | Observações |
|---|---|---|---|---|
| **Vozes do sistema** (Web Speech API `speechSynthesis`; no Android, TTS do sistema) | Grátis | Geralmente no aparelho (algumas vozes podem usar a nuvem do sistema) | Varia muito por aparelho | Controle de velocidade; eventos por palavra (nem sempre); variantes dependem do sistema |
| **Modelo neural local** (ex.: modelos leves de TTS rodando em WebAssembly/WebGPU) | Grátis | No aparelho | Boa | Download de dezenas de MB; verificar licença e variantes (en-AU pode não existir) |
| **BYOK em nuvem** (ex.: Azure Speech, ElevenLabs, Google, OpenAI) | Cota grátis ou pago pelo usuário | Áudio/texto vão ao provedor do usuário | Muito boa; alguns dão visemes para sincronia labial | Chave no cofre, domínio fixo, consentimento |

## Reconhecimento e avaliação de pronúncia (o aluno falando)
| Opção | Custo | Privacidade | Literal? | Fonemas? | Observações |
|---|---|---|---|---|---|
| **Reconhecimento do navegador** (Web Speech `SpeechRecognition`) | Grátis | Em alguns navegadores o áudio vai para servidores do fabricante | **Não** (arredonda) | Não | Só como referência no benchmark; indisponível em vários WebViews |
| **Modelo de transcrição local** (família Whisper via transformers.js/onnxruntime-web) | Grátis | No aparelho | Parcial (tende a "limpar" a fala; dá tempos por palavra) | Não | Download grande; latência a medir |
| **Modelo de fonemas local** (ex.: modelos acústicos treinados para reconhecer fonemas) | Grátis | No aparelho | — | **Sim** | Base para GOP; verificar licença e tamanho |
| **BYOK: Azure Speech — Pronunciation Assessment** | Cota F0 de 5 h/mês de transcrição (se a avaliação de prosódia entra na cota: **não confirmado**) | Nuvem do provedor do usuário | Sim (com texto de referência) | **Sim** (nota por fonema) | Suporte a variantes a confirmar |
| **BYOK: outros** (Deepgram, AssemblyAI, Google, OpenAI) | Pago/cota | Nuvem | Alguns têm opção de manter hesitações | Em geral não | Úteis para fala livre literal |

## Estratégia proposta (ADR-0007)
1. **TTS:** vozes do sistema no início (F07); modelo neural local se passar no benchmark; BYOK como "voz premium".
2. **Avaliação com texto esperado:** modelo de fonemas local + GOP (`precisao-matematica-e-metricas.md`); BYOK Azure como alternativa de maior precisão.
3. **Fala livre:** transcrição local literal + confiança por palavra; BYOK opcional.
4. **Claude:** só texto — explica as evidências medidas (`speech.explain`).

## Regras para provedores BYOK de voz
- Chave guardada no **mesmo cofre** (`core/vault`), com `ProviderId` próprio e **domínio fixo**.
- Domínio do provedor entra na CSP `connect-src` só quando a integração existir (registrado em ADR).
- Consentimento específico (`cloud_voice_provider`) explicando: "o áudio da sua fala vai para <provedor>, sob a sua conta".
- Teste E2E de rede: a chave de voz só aparece nas requisições ao domínio do provedor dela.
- Estimativa de custo/cota exibida ao usuário quando possível.

## Clonagem de voz (registrada no backlog — BL-03)
- Nunca clonar a voz de pessoas reais sem consentimento.
- Ideia futura: o aluno ouvir a **própria** voz com pronúncia ideal — só com opt-in forte, explicação clara e provedor BYOK; voz é dado pessoal sensível quando usada para identificação.
