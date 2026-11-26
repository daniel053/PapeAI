# Precisão da fala — matemática, métricas e calibração

> Descrição objetiva para quem vai implementar (humano ou IA). Toda métrica aqui é **calculada por código** e testada; a IA de texto só recebe os resultados (`SpeechEvidence`).
> Limiares marcados **(calibrar)** são pontos de partida e serão ajustados com dados rotulados na F07.

## 1. Normalização de texto (antes de comparar)
- Minúsculas; espaços colapsados; aspas e apóstrofos tipográficos → `'`.
- Remove pontuação **exceto** apóstrofos internos (*don't*, *it's*).
- **Não** expande contrações (*I'm* ≠ *I am* — diferença real de fala).
- Números por extenso no texto de referência (*25* → *twenty-five*) para comparar com a fala.

## 2. Alinhamento de palavras e WER
Alinhamento por distância de edição (Levenshtein / Needleman–Wunsch) entre referência `R` (N palavras) e hipótese `H`:
- **S** = substituições, **D** = omissões, **I** = inserções, **C** = acertos.
- **WER = (S + D + I) / N**
- Classificação por palavra: correta · substituída · omitida · inserida.
- **Completude** = C / N (o aluno disse tudo?).

## 3. Fonemas e GOP (*Goodness of Pronunciation*)
1. **Fonemas esperados:** dicionário de pronúncia (G2P) por variante — com licença compatível (ver ADR-0009; dicionários GPL exigem análise antes de embutir).
2. **Fonemas reconhecidos:** modelo acústico de fonemas que dá, para cada quadro de áudio (~20 ms), a probabilidade de cada fonema.
3. **Alinhamento forçado:** encaixa os fonemas esperados nos quadros de áudio (programação dinâmica sobre as probabilidades).
4. **GOP por fonema** `p`, com `T_p` quadros alinhados:

   `GOP(p) = (1/T_p) · Σₜ [ log P(p | oₜ) − log maxᵩ P(q | oₜ) ]`

   (≈ 0 quando `p` é o som mais provável; muito negativo quando outro som domina).
5. **Nota 0–100 por fonema:** `nota = 100 / (1 + e^(−a·(GOP − b)))` com `a`, `b` **(calibrar)** contra rótulos humanos.
6. **Fonema provavelmente trocado:** o `q` que domina os quadros de `p` (ex.: esperado /θ/, dominante /f/) → feedback "você disse /f/ em *think*".
7. **Nota da palavra:** média das notas dos fonemas ponderada pela duração; **nota da frase:** média ponderada das palavras + penalidade por omissões.
8. **PER** (*phoneme error rate*) = análogo do WER no nível de fonemas.

## 4. Prosódia
### 4.1 Frequência fundamental (F0) — algoritmo YIN
Janela de 30–40 ms, passo de 10 ms, faixa 60–400 Hz:
1. Diferença: `d(τ) = Σⱼ (xⱼ − xⱼ₊τ)²`
2. Diferença normalizada cumulativa: `d'(τ) = d(τ) / [(1/τ) · Σ_{j=1..τ} d(j)]`, com `d'(0) = 1`
3. Primeiro `τ` com `d'(τ) < 0,1–0,15` **(calibrar)**; refinamento por interpolação parabólica.
4. `F0 = taxa_de_amostragem / τ`; quadro sem `τ` válido = **não vozeado**.

### 4.2 Normalização por semitons (compara vozes diferentes)
`st(t) = 12 · log₂( F0(t) / F_ref )`, onde `F_ref` = mediana da F0 vozeada do próprio falante.

### 4.3 Comparar entonação com a referência — DTW
Curvas em semitons do aluno (`u`) e da referência (`r`, voz do tutor ou gravação nativa):
`D(i, j) = |uᵢ − rⱼ| + min( D(i−1, j), D(i, j−1), D(i−1, j−1) )`
Distância normalizada = `D(n, m) / (n + m)` → **similaridade de entonação** 0–100 por mapeamento calibrado **(calibrar)**.

### 4.4 Movimento final (pergunta x afirmação)
Regressão linear da F0 (semitons) nos últimos 300–500 ms vozeados → inclinação em st/s.
Subida > +X st/s **(calibrar)** = final ascendente. Comparar com o padrão esperado da frase (tendência, não regra: perguntas sim/não costumam subir; perguntas com *wh-* costumam descer no inglês americano).

### 4.5 Intensidade e tonicidade
- Intensidade por quadro: `I = 20 · log₁₀(RMS)` (dB relativo).
- Proeminência de sílaba = combinação de intensidade de pico, duração e pico de F0 dentro da sílaba alinhada.
- Comparar a sílaba mais proeminente com a tonicidade do dicionário (ex.: *PHOtograph* x *phoTOgraphy*).

## 5. Fluência e ritmo
| Métrica | Fórmula | Uso |
|---|---|---|
| Velocidade de fala | sílabas / duração total (síl/s) | Comparar com a referência do nível |
| Taxa de articulação | sílabas / (duração − tempo de pausas) | Separa "devagar" de "com muitas pausas" |
| Palavras por minuto | palavras / minutos | Exibição amigável |
| Pausas silenciosas | silêncios ≥ 250 ms **(calibrar)** entre palavras | Contagem, duração média, posição (dentro x entre frases) |
| Média de sílabas entre pausas (MLR) | sílabas / (nº de pausas + 1) | Fluência |
| Hesitações | *uh, um, hmm* e também *é…, tipo, então* | Contagem por minuto |
| Autocorreções e repetições | tokens repetidos / falsos começos | Fluência |

Faixas "esperadas" por nível são **hipóteses a calibrar**, nunca rótulos fixos.

## 6. Confiança e incerteza
- Confiança por palavra do reconhecedor → **incerta** abaixo de um limiar **(calibrar)**.
- Feedback de pronúncia só para palavras com alinhamento confiável.
- Mensagem honesta: "Não tenho certeza se você disse *think* ou *sink* — quer repetir?"
- Ambiente ruidoso (relação sinal/ruído estimada baixa) → aviso antes de avaliar.

## 7. O objeto `SpeechEvidence` (o que a IA de texto recebe)
```json
{
  "mode": "scripted",
  "reference_text": "I think it's three o'clock.",
  "transcript_verbatim": "I fink it's tree o'clock",
  "words": [
    { "text": "think", "status": "substituted", "heard": "fink", "score": 42, "confidence": 0.81,
      "phonemes": [ { "expected": "θ", "dominant": "f", "score": 18 } ] },
    { "text": "three", "status": "substituted", "heard": "tree", "score": 51, "confidence": 0.77,
      "phonemes": [ { "expected": "θ", "dominant": "t", "score": 25 } ] }
  ],
  "prosody": { "speech_rate_syl_s": 3.1, "pauses": 1, "final_contour": "falling", "intonation_similarity": 72 },
  "fluency": { "fillers": 0, "repetitions": 0 },
  "uncertain_words": [],
  "audio_quality": { "snr_ok": true }
}
```
Regras: números e rótulos vêm **só** do código; a IA transforma isso em explicação curta, gentil (ou "sem filtro") e com um exercício de correção.

## 8. Calibração (F07)
1. Conjunto rotulado (gravações do dono + voluntários com consentimento): o que foi dito de fato, fonemas errados, notas humanas de 1 a 5.
2. Ajustar `a`, `b`, limiares e faixas para maximizar a concordância com os rótulos.
3. Medir: correlação (Spearman) entre notas do sistema e humanas (meta inicial ≥ 0,6 **(calibrar)**); precisão/recall de "fonema errado".
4. Versionar parâmetros em `app/src/config/speech.ts`, com data e conjunto usado.
5. Recalibrar quando trocar de modelo.

## 9. Limites honestos (vão para a tela de ajuda e para o "jabá")
- Nenhum sistema é 100% preciso; ruído, microfone e sotaques afetam o resultado.
- O objetivo é **ser entendido**, não eliminar o sotaque.
- Quando o sistema não tem certeza, ele diz.

## Testes unitários obrigatórios
- YIN com senoides sintéticas (100, 220, 440 Hz) → erro < 1%.
- Pausas: sinal com silêncios conhecidos → contagem e durações exatas.
- WER/alinhamento: casos de tabela com S/D/I conhecidos.
- DTW: curvas idênticas → distância 0; deslocadas no tempo → distância baixa.
- GOP: probabilidades sintéticas → sinais e ordenação corretos.
