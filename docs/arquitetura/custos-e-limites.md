# Custos e limites

> Números verificados na web em **2026-11-26**. Planos gratuitos mudam: a IA reconfirma na fase em que o serviço entra e atualiza esta tabela com data e fonte.

## Quem paga o quê
| Item | Quem paga | Quanto |
|---|---|---|
| Uso da IA (tokens) | **O usuário**, direto à Anthropic, com a chave dele | Por consumo — ver `../ia/economia-de-tokens-e-custos.md` |
| Voz em nuvem (opcional) | O usuário, com a chave dele | Depende do provedor; vários têm cota gratuita |
| Infraestrutura do projeto | Projeto | R$ 0 nos planos gratuitos |
| Domínio | Projeto | ~R$ 40/ano (`.com.br`) — recomendado a partir da F09 |
| Google Play | Projeto | US$ 25, taxa única — F10 |
| Apple Developer | Projeto | US$ 99/ano — só se houver iOS (F12) |
| Créditos de API para desenvolver | Dono (ou créditos inclusos no plano Max/Ultra/Team) | Pré-pago; manter limite baixo |

## Serviços e limites dos planos gratuitos
| Serviço | Limites relevantes (plano gratuito) | Risco para o PapeAI | Plano B | Fonte |
|---|---|---|---|---|
| **Supabase** | 500 MB de banco, 1 GB de arquivos, 5 GB de tráfego, 50.000 usuários ativos/mês, 2 projetos ativos; **projeto pausa após 7 dias sem atividade** | Pausa durante o desenvolvimento (basta reativar no painel); banco cheio só com muitos usuários (guardamos pouco) | Plano Pro quando houver tração; limpeza de logs antigos | [supabase.com/pricing](https://supabase.com/pricing) · [resumo 2026](https://dev.to/mahdi_benrhouma_fe1c6005/supabase-free-tier-limits-in-2026-what-you-actually-get-and-when-you-will-hit-them-4mhe) |
| Supabase — mudança a confirmar | Relato de que projetos novos (a partir de 30/05/2026) precisam de **grants explícitos** no Postgres para o acesso via API, e projetos gratuitos existentes a partir de 30/10/2026 (fonte única) | Tabelas "invisíveis" se faltar grant | Nosso padrão já prevê grants explícitos por tabela/coluna | Confirmar na documentação oficial na F02 |
| **Resend** (e-mail) | 3.000 e-mails/mês, **100/dia** (conta envios e recebimentos) | Resumo semanal para >100 usuários num só dia | Escalonar envios por dia da semana; plano pago ou Brevo | [docs Resend](https://resend.com/docs/knowledge-base/account-quotas-and-limits) · [preços](https://resend.com/pricing) |
| **Cloudflare** (hospedagem estática) | Plano gratuito generoso para sites estáticos (confirmar limites de builds/requisições na F01) | Baixo | Netlify | Confirmar na F01 |
| **GitHub** | Actions gratuitas em repositório público; repositório privado tem cota mensal de minutos | Baixo | Rodar só o essencial em PR | Confirmar na F01 |
| **Cloudflare Turnstile** | Gratuito | Baixo | hCaptcha | Confirmar na F02 |
| **Google Cloud (OAuth)** | Login com Google sem custo para escopos básicos (e-mail, perfil) | Tela de consentimento mostra domínio do Supabase sem domínio próprio | Domínio próprio + verificação de marca | Confirmar na F02 |
| **Azure Speech** (BYOK do usuário) | Plano F0: 5 h/mês de transcrição padrão; avaliação de pronúncia dá nota por fonema; se a prosódia entra na cota gratuita **não foi confirmado** | Usuário pode gastar sem perceber | Mostrar aviso e estimativa | [preços Azure Speech](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/) |

## Regras da Google Play e do Android (impactam a F10)
| Regra | O que significa | Fonte |
|---|---|---|
| Contas **pessoais** criadas após 13/11/2023 precisam de **teste fechado com ≥ 12 testadores, por 14 dias seguidos**, antes de publicar | Planejar testadores desde o M2 (Q-14). Contas de organização não têm essa exigência | [Ajuda Play Console](https://support.google.com/googleplay/android-developer/answer/14151465) |
| **Verificação de desenvolvedor Android** em vigor no Brasil desde 30/09/2026 para apps instalados em aparelhos certificados | Distribuir APK fora da Play exige desenvolvedor verificado; **instalar no seu próprio aparelho via ADB/Android Studio continua permitido** | [Android Developers](https://developer.android.com/developer-verification/guides) · [Ajuda](https://support.google.com/android-developer-console/answer/16561738) · [Android Authority](https://androidauthority.com/android-sideloading-developer-verification-first-wave-rollout-3717921) |

## Alertas que vamos monitorar
| Métrica | Alerta | Onde ver |
|---|---|---|
| Tamanho do banco | > 300 MB | Painel do Supabase |
| Usuários ativos/mês | > 35.000 | Painel do Supabase |
| E-mails/dia | > 80 | Painel do Resend + `private.email_log` |
| Tráfego de saída | > 3,5 GB/mês | Painel do Supabase |
| Projeto pausado | Sempre que acontecer em produção | E-mail do Supabase |

## Custo do projeto por marco (estimativa)
| Marco | Custo do projeto |
|---|---|
| M1 (F04) | R$ 0 + créditos de API do dono para testes |
| M2 (F09) | + domínio (~R$ 40/ano), se aprovado |
| M3 (F10) | + US$ 25 (Play, uma vez) |
| M4 (F11) | sem novos custos obrigatórios |
