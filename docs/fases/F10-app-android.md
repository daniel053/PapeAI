# F10 — App Android (Capacitor) e loja

> **Status:** ⏳ Não iniciada · **Marco ao final: M3 — Android**

## Objetivo
"Embrulhar" o mesmo app web num **app Android** com recursos nativos (cofre no Keystore, notificações, microfone, login nativo do Google, App Links), instalar o APK no seu celular para testes e iniciar o **teste fechado** na Google Play.

## Documentos desta fase
1. ADR-0001 (web primeiro + Capacitor)
2. `../arquitetura/estrutura-de-pastas-e-modulos.md` (adaptadores de plataforma)
3. `../seguranca/cofre-da-chave-api.md` (implementação nativa)
4. `../seguranca/autenticacao-e-sessoes.md` (login nativo)
5. `../arquitetura/custos-e-limites.md` (regras da Play e verificação de desenvolvedor)
6. `../seguranca/privacidade-lgpd.md` (formulário de segurança dos dados)
7. `../seguranca/checklist-de-seguranca-por-fase.md` (F10)

## Pré-requisitos
- F09 aprovada. Q-14 resolvida (12+ testadores). Dono de acordo com a taxa da Play (Q-04).

## Escopo
**Inclui:** Android Studio/SDK, Capacitor + plataforma Android, adaptadores nativos (armazenamento seguro, notificações locais/push, microfone, ciclo de vida), login nativo do Google → `signInWithIdToken`, App Links (`assetlinks.json`), endurecimento Android, testes no aparelho (3D, voz, WASM no WebView), APK de debug via ADB, build de release (AAB) com Play App Signing, conta na Play Console, ficha da loja, formulário de segurança dos dados, classificação etária, URL de exclusão de conta, teste fechado (≥ 12 testadores por 14 dias seguidos).
**Não inclui:** iOS (F12), publicação em produção (F11, após o teste fechado).

## Passos
### A. Ambiente
- [ ] Instalar Android Studio + SDK + emulador; habilitar depuração USB no celular do dono.
- [ ] Verificar versões atuais do Capacitor e dos plugins (fichas de dependência — plugin de armazenamento seguro escolhido aqui, com verificação de reputação).

### B. Capacitor
- [ ] Adicionar Capacitor e a plataforma Android ao `app/`; app ID definitivo (ex.: `br.com.<dominio>.app` — **não muda depois**).
- [ ] Adaptadores nativos registrados na inicialização (o `core/` não muda).

### C. Login e links
- [ ] Cliente OAuth Android no Google Cloud (SHA-1/SHA-256 do certificado de assinatura e de upload).
- [ ] Login nativo → `signInWithIdToken` (com nonce), confirmando a API atual na documentação.
- [ ] App Links verificados (`/.well-known/assetlinks.json` no domínio); evitar esquemas customizados para OAuth.

### D. Endurecimento
- [ ] Cofre no Keystore; dados do cofre excluídos do backup; `FLAG_SECURE` na tela da chave.
- [ ] Tráfego só HTTPS (sem cleartext); WebView com depuração desligada em release.
- [ ] Permissões mínimas no manifesto (microfone, notificações, internet).

### E. Testes no aparelho
- [ ] Mascote 3D (FPS), voz (modelos/WASM no WebView), notificações, offline, login, cofre.
- [ ] TalkBack nas telas principais.
- [ ] APK de debug instalado via ADB/Android Studio (permitido mesmo com a verificação de desenvolvedor em vigor).

### F. Release e loja
- [ ] Chave de upload gerada e **guardada com backup offline seguro**; Play App Signing ativo.
- [ ] Conta na Play Console (taxa única), com MFA; avaliar requisitos atuais de verificação de desenvolvedor.
- [ ] Ficha da loja em pt-BR (descrição honesta, capturas, ícone), política de privacidade, URL de exclusão de conta.
- [ ] Formulário de "Segurança dos dados" coerente com `../seguranca/privacidade-lgpd.md` (a chave e as conversas não são coletadas pelo app).
- [ ] Classificação de conteúdo; público-alvo 18+.
- [ ] Teste fechado com ≥ 12 testadores por 14 dias seguidos (acompanhar o contador; não deixar cair abaixo de 12).

## Segurança nesta fase
Seção F10 do checklist. Rodar `/security-review` no PR da plataforma nativa.

## Testes e verificações
- Matriz: celular do dono + emulador (versão mínima e atual do Android suportadas).
- E2E web continuam verdes (o código é o mesmo).
- Checklist da Play preenchido e revisado pelo dono.

## Riscos e armadilhas
| Risco | Mitigação |
|---|---|
| Perder a chave de upload | Play App Signing + backup offline cifrado da chave de upload |
| Teste fechado reiniciar por queda de testadores | Convidar 15–20; lembrar os testadores |
| Recursos web que não funcionam no WebView | Testados cedo na F07; adaptadores nativos |
| Regras da Play/Android mudarem | Reconfirmar na documentação oficial no início da fase |

## O que você vai aprender
- Como um app web vira app Android (WebView + plugins nativos).
- O que é assinatura de app, AAB e o processo de publicação na Play.

## Portão de aprovação F10 (M3)
**Critérios:**
- [ ] App Android com todas as funcionalidades do web, instalado no celular do dono.
- [ ] Cofre no Keystore verificado; tela da chave sem captura.
- [ ] Login nativo do Google funcionando.
- [ ] Ficha da loja, segurança dos dados e URL de exclusão prontas.
- [ ] Teste fechado em andamento com ≥ 12 testadores.

**Roteiro de teste do dono (30 min):**
1. Instale o APK via cabo (a IA guia), entre com Google, cole a chave.
2. Faça uma lição completa com voz e mascote.
3. Tente tirar print da tela da chave (deve ficar preto/bloqueado).
4. Coloque em modo avião e faça uma revisão.
5. Confira na Play Console o número de testadores do teste fechado.
6. Diga **"aprovado F10"** — M3 atingido. 🎉
