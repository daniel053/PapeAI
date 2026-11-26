# F07 — Voz: ouvir e falar com precisão

> **Status:** ⏳ Não iniciada

## Objetivo
O tutor **fala** (legendas opcionais, velocidade ajustável, vozes/sotaques) e o app **ouve com precisão**: transcrição literal, avaliação de pronúncia por fonema, métricas de ritmo, pausas e entonação — tudo medido por código, no aparelho, e explicado pelo tutor só a partir das evidências.

## Documentos desta fase
1. `../voz/pipeline-de-fala.md`
2. `../voz/precisao-matematica-e-metricas.md`
3. `../voz/provedores-de-voz.md`
4. ADR-0007
5. `../seguranca/cofre-da-chave-api.md` (provedores BYOK) e `../seguranca/seguranca-web-headers-csp-robots.md` (ajustes de CSP)
6. `../seguranca/privacidade-lgpd.md` (consentimento de voz em nuvem)
7. `../ia/controle-de-alucinacao-do-tutor.md` (H7)

## Pré-requisitos
- F06 aprovada. Q-15 respondida.

## Escopo
**Inclui:** spike de benchmark e decisão (ADR-0007), captura + checagem de microfone + detecção de fala, TTS com legendas (sempre/tocar para revelar/desligadas), destaque por palavra, velocidade e "repetir mais devagar", vozes por variante, reconhecimento literal, avaliação de pronúncia (texto conhecido), prosódia e fluência, `SpeechEvidence` + `speech.explain`, atividades de voz (ler em voz alta, *shadowing*, pares mínimos, ditado, compreensão auditiva, desafio sem legendas), etapa de voz do nivelamento, provedor BYOK opcional, ajustes de CSP.
**Não inclui:** sincronia labial do mascote (F08), clonagem de voz (backlog).

## Passos
### A. Spike de benchmark (primeiro!)
- [ ] Conjunto de teste rotulado (gravações do dono com erros propositais típicos; voluntários com consentimento).
- [ ] Candidatos locais e BYOK (verificar existência, licença e tamanho de cada modelo/serviço).
- [ ] Medir WER literal, detecção de erros de pronúncia, latência, tamanho, bateria — no celular do dono.
- [ ] Relatório comparativo → decisão do dono → ADR-0007 **Aceita**.

### B. Captura
- [ ] Permissão do microfone só no uso, com explicação; checagem de nível e ruído; apertar para falar; parada por silêncio; indicador de microfone ativo.

### C. TTS
- [ ] Motor escolhido; vozes por variante; legendas em 3 modos; destaque por palavra; velocidade 0,5–1,25×; "repetir mais devagar".

### D. Reconhecimento e pronúncia
- [ ] Reconhecimento literal com hesitações e confiança por palavra.
- [ ] Alinhamento + fonemas + GOP; mapeamento de notas calibrado.
- [ ] Prosódia (YIN, semitons, DTW, final da frase, intensidade/tonicidade) e fluência (velocidade, pausas, MLR, hesitações).
- [ ] Testes unitários com sinais sintéticos (lista em `../voz/precisao-matematica-e-metricas.md`).

### E. Evidências e explicação
- [ ] `SpeechEvidence` montado só por código; rota `speech.explain`; suíte de eval `speech-grounding` (zero comentários sem evidência).
- [ ] Tela de resultado: transcrição colorida, notas, ouvir minha gravação × referência, mensagens de incerteza.

### F. Atividades e nivelamento
- [ ] Atividades de voz do catálogo + alternativas sem fala.
- [ ] Etapa opcional de voz no nivelamento (NIV-08).

### G. Provedor BYOK (opcional, se aprovado)
- [ ] Chave no cofre com domínio fixo; CSP atualizada; consentimento `cloud_voice_provider`; teste E2E de rede.

### H. Ajustes técnicos
- [ ] CSP com `wasm-unsafe-eval` (se modelos WASM) e, se necessário, COEP/COOP para desempenho — registrados em ADR.
- [ ] Download de modelos sob demanda (Wi-Fi), com tamanho informado e cache local.

## Segurança nesta fase
Seção F07 do checklist: áudio nunca vai ao nosso servidor (teste E2E), permissões mínimas, origem fixa dos modelos.

## Testes e verificações
- Unitários de métricas (sinais sintéticos).
- Calibração: correlação com notas humanas registrada.
- E2E: atividade de voz com áudio de teste; verificação de rede.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Modelos locais grandes/lentos no celular | Benchmark antes; modo leve; BYOK como alternativa |
| Reconhecimento "corrigindo" o aluno | Comparação por fonemas quando há texto esperado; incerteza exposta |
| WebView sem suporte a algum recurso | Testar cedo (antecipa a F10) |
| Promessa de precisão maior que a real | Texto do "jabá" só depois das métricas medidas |

## O que você vai aprender
- Como o áudio vira números (frequência, energia) e o que é um fonema.
- Por que comparar sons é diferente de comparar palavras.

## Portão de aprovação F07
**Critérios:**
- [ ] Relatório do benchmark aprovado; ADR-0007 aceita.
- [ ] TTS com legendas (3 modos), velocidade e vozes funcionando.
- [ ] Erros propositais detectados no nível de fonema em frases conhecidas.
- [ ] Nenhum áudio sai do aparelho (exceto BYOK com consentimento).
- [ ] Eval `speech-grounding` com zero violações.

**Roteiro de teste do dono (30 min):**
1. Ouça o tutor com legendas "sempre", "tocar para revelar" e "desligadas"; teste 0,75×.
2. Leia "I think it's three o'clock" falando "fink" e "tree" de propósito; veja se o app aponta /θ/.
3. Leia a mesma frase corretamente e compare as notas.
4. Faça uma conversa falada curta e confira se a transcrição mostra o que você disse (inclusive "é…", "uh").
5. Diga **"aprovado F07"** ou o que precisa mudar.
