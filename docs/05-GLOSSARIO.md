# 05 — Glossário (em linguagem simples)

| Termo | O que é |
|---|---|
| **ADR** | *Architecture Decision Record*: um documento curto registrando uma decisão, as alternativas e o porquê. Fica em `docs/decisoes/`. |
| **Alucinação (IA)** | Quando a IA afirma algo falso com confiança: uma função que não existe, uma correção errada, um fato inventado. |
| **API** | Uma "porta" para um programa conversar com outro. A API do Claude recebe texto e devolve texto. |
| **APK / AAB** | Arquivos de app Android. APK instala direto no celular; AAB é o formato que a Google Play exige. |
| **ASR / STT** | Reconhecimento de fala (*speech-to-text*): transforma áudio em texto. |
| **BYOK** | *Bring Your Own Key*: o usuário traz a própria chave de API. |
| **Cache de prompt** | Recurso da API que reaproveita a parte repetida do prompt, cobrando bem menos por ela. |
| **Capacitor** | Ferramenta que "embrulha" um app web num app Android/iOS de verdade, com acesso a recursos nativos. |
| **CEFR (QECR)** | Quadro Europeu Comum de Referência: níveis Pre-A1, A1, A2, B1, B2, C1, C2. |
| **Chave de API** | Uma senha longa que identifica sua conta na API e permite cobrar o consumo. Quem tem a chave gasta seus créditos — por isso ela é tão protegida. |
| **CI** | *Continuous Integration*: o GitHub roda testes automaticamente a cada mudança. |
| **CORS** | Regra do navegador que controla quais sites podem chamar quais APIs. |
| **CSP** | *Content Security Policy*: cabeçalho que diz ao navegador de quais domínios o app pode carregar scripts e para quais pode enviar dados. É a "cerca" que impede a chave de ir para outro lugar. |
| **Cofre (vault)** | Módulo do app que guarda a chave de API cifrada. Só ele toca a chave. |
| **DTW** | *Dynamic Time Warping*: algoritmo que compara duas curvas (ex.: entonação sua x referência) mesmo com velocidades diferentes. |
| **Edge Function** | Pequena função que roda no servidor do Supabase (ex.: enviar e-mail, excluir conta). É onde ficam os segredos do servidor. |
| **Effort (esforço)** | Parâmetro da API do Claude que controla quanto o modelo "pensa" — e quanto gasta. |
| **Eval** | Conjunto de testes que mede a qualidade das respostas da IA antes de mudar um prompt ou modelo. |
| **F0 (frequência fundamental)** | A "altura" da voz em cada momento; base da análise de entonação. |
| **Fonema** | O menor som que diferencia palavras (ex.: /θ/ de "think" x /f/ de "fink"). |
| **FSRS** | Algoritmo moderno de revisão espaçada: calcula o melhor dia para revisar cada palavra. |
| **G2P** | *Grapheme-to-phoneme*: converte a escrita de uma palavra nos fonemas esperados. |
| **glTF / GLB** | Formato padrão de modelos 3D para web (o "JPEG do 3D"). GLB é a versão em arquivo único. |
| **GOP** | *Goodness of Pronunciation*: nota matemática de quão bem um fonema foi pronunciado. |
| **IPA** | Alfabeto Fonético Internacional (ex.: /ˈwɔːtər/). |
| **JWT** | Token de sessão assinado que prova que você está logado. Expira e é renovado automaticamente. |
| **LGPD** | Lei Geral de Proteção de Dados (Brasil). |
| **Low poly** | Modelo 3D com poucos polígonos: leve e estilizado. |
| **MFA / 2FA** | Autenticação em dois fatores (senha + código/app/chave de segurança). |
| **Migração (banco)** | Arquivo SQL numerado que muda a estrutura do banco de forma controlada e repetível. |
| **Morph target / viseme** | Formas da boca do modelo 3D usadas para "falar" (ex.: forma do "O", do "M"). |
| **OAuth / PKCE** | Protocolo do "Entrar com Google". PKCE é a proteção extra que impede roubo do código de login. |
| **OTP** | *One-time password*: código de uso único enviado por e-mail. |
| **Portão (gate)** | Ponto de aprovação no fim de cada fase. Sem "aprovado", não há próxima fase. |
| **Prosódia** | Música da fala: entonação, ritmo, acento, pausas. |
| **PWA** | *Progressive Web App*: site que pode ser "instalado" no celular como app. |
| **RLS** | *Row Level Security*: regra do Postgres que garante que cada usuário só leia/escreva as próprias linhas. |
| **robots.txt** | Arquivo público que pede a buscadores para não indexar certas páginas. **Não é proteção.** |
| **Schema (banco)** | A estrutura do banco: tabelas, colunas, tipos, regras. |
| **Slopsquatting** | Golpe em que criminosos publicam pacotes com nomes que IAs costumam inventar, esperando que alguém instale. |
| **SRS** | Revisão espaçada (*spaced repetition*): revisar no momento certo para não esquecer. |
| **Streaming** | A resposta da IA aparece aos poucos, enquanto é gerada. |
| **Structured outputs** | Recurso da API que obriga a resposta a seguir um formato JSON definido. |
| **Supabase** | Plataforma com banco Postgres, login, armazenamento e funções. Tem plano gratuito. |
| **Token (IA)** | Pedaço de texto (~¾ de palavra em inglês) usado para medir e cobrar o uso da IA. |
| **Token (sessão)** | Credencial de login (JWT). Nada a ver com custo. |
| **TTS** | *Text-to-speech*: transforma texto em fala. |
| **VAD** | *Voice Activity Detection*: detecta quando a pessoa começou/parou de falar. |
| **Verbatim** | Transcrição literal: exatamente o que foi dito, com hesitações e erros. |
| **Vibe coding** | Programar conversando com a IA: você conduz e aprova; a IA escreve e verifica. |
| **WCAG** | Diretrizes internacionais de acessibilidade web. |
| **WER** | *Word Error Rate*: porcentagem de palavras erradas numa transcrição. |
| **XSS** | Ataque em que um script malicioso roda dentro do seu site — o principal risco para uma chave guardada no navegador. |
