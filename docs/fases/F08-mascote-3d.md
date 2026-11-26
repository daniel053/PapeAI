# F08 — Mascote 3D

> **Status:** ⏳ Não iniciada (a trilha paralela de arte pode começar após a F00)

## Objetivo
O mascote 3D final — low poly, bordas suaves, textura 128×128, animado — integrado ao app, reagindo às emoções do tutor, "falando" junto com o TTS, leve o bastante para 60 FPS em celular intermediário e com alternativas acessíveis.

## Documentos desta fase
1. `../design/mascote-3d.md` (especificação e critérios de aceite)
2. `../design/identidade-visual-e-marca.md`
3. `../ia/personalidade-e-modos-de-feedback.md` (mapa emoção → animação)
4. `../voz/pipeline-de-fala.md` (eventos do TTS para a boca)
5. ADR-0005 (direitos da arte)

## Pré-requisitos
- F07 aprovada (TTS pronto). Animal escolhido (Q-02) e conceito aprovado na trilha de arte.

## Escopo
**Inclui:** modelagem/rig/animações (Blender), exportação `.glb` compactada, cena com three.js + React Three Fiber, máquina de estados, mapa de emoções, sincronia labial nível 1 (amplitude) e nível 2 se houver visemes, medição de desempenho, movimento reduzido, ocultar mascote, reserva 2D, licença dos assets.
**Não inclui:** roupas/acessórios (F12, premium cosmético), mascotes alternativos.

## Passos
### A. Arte (Blender — a IA pode ajudar via MCP do Blender, sempre com aprovação por etapa)
- [ ] Folha de modelo aprovada (frente/lado/costas, paleta).
- [ ] Bloqueio → refino low poly → chanfros + normais suaves.
- [ ] UV + atlas de paleta 128×128 (+ textura do rosto, se a técnica escolhida for troca de UV).
- [ ] Rig (≤ 30 ossos) + formas do rosto.
- [ ] Todas as animações da tabela, com os nomes exatos.
- [ ] Exportar `.glb` com compressão de malha; conferir tamanho ≤ 400 KB.

### B. Integração
- [ ] Verificar versões/APIs atuais de three.js, React Three Fiber e drei (ficha de dependências).
- [ ] Cena leve: 1 luz principal + ambiente, sombra falsa, pixel ratio ≤ 2, pausa com aba oculta.
- [ ] Máquina de estados (idle, listening, think, talk, reaction, sleep) com *crossfade*.
- [ ] `mascot_emotion` → clipe de reação (mapa do documento de personalidade).
- [ ] Sincronia labial pela amplitude do áudio do TTS.

### C. Desempenho e acessibilidade
- [ ] Medir FPS, memória e tempo de carregamento no celular do dono; registrar em `../design/mascote-3d.md`.
- [ ] `prefers-reduced-motion`, opção "ocultar mascote", reserva 2D (sprites) para aparelhos sem WebGL/fracos.

### D. Direitos
- [ ] Licença dos assets e aviso de marca registrados; créditos de terceiros (se houver).

## Segurança nesta fase
Seção F08 do checklist: assets servidos do próprio domínio; nenhum carregamento externo; licenças registradas.

## Testes e verificações
- Teste automatizado: o `.glb` contém todos os clipes com os nomes esperados; orçamento de triângulos/tamanho verificado em script.
- Medições de desempenho no relatório.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Modelo pesado | Orçamento verificado por script na CI |
| Mascote "esquisito" | Aprovação do conceito antes de modelar; iterações curtas |
| Compressão de malha incompatível | Testar meshopt x Draco no navegador e no WebView |
| Bateria | Pausa quando oculto; FPS limitado quando ocioso |

## O que você vai aprender
- O que é um modelo 3D (malha, UV, textura, rig, animação) e o formato glTF.
- Como uma cena 3D roda no navegador e o que custa desempenho.

## Portão de aprovação F08
**Critérios:** todos os itens de "Critérios de aceite" em `../design/mascote-3d.md`.

**Roteiro de teste do dono (15 min):**
1. Converse com o tutor e observe as reações (acerto, erro, fim de lição).
2. Ative o modo sem filtro e veja o *facepalm* seguido de incentivo.
3. Ouça o tutor e veja a boca acompanhar a fala.
4. Ative "movimento reduzido" no sistema e depois "ocultar mascote".
5. Diga **"aprovado F08"** ou o que precisa mudar.
