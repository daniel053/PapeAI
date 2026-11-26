# Privacidade e LGPD

> ⚠️ Este documento organiza obrigações e boas práticas; **não é aconselhamento jurídico**. Antes do lançamento público (F11), o ideal é uma revisão por profissional. Referências a resoluções da ANPD estão marcadas "confirmar" e serão verificadas na F11.

## Papéis
| Papel (LGPD) | Quem | Observação |
|---|---|---|
| **Controlador** | O projeto PapeAI (o dono) | Decide finalidades e meios |
| **Operadores** | Supabase (banco/Auth), Cloudflare (hospedagem), Resend (e-mail), Google (login, se usado) | Contratos/termos de processamento de dados dos provedores |
| **Fora da nossa cadeia** | Anthropic e provedores de voz BYOK | O usuário contrata **diretamente** com eles usando a própria chave. As conversas vão do aparelho do usuário para o provedor; o PapeAI não recebe esse conteúdo. Explicar isso de forma clara (PRIV-10) e linkar as políticas do provedor |

## Inventário de dados (o que tratamos, por quê e por quanto tempo)
| Dado | Finalidade | Base legal (art. 7º) | Onde | Retenção | Compartilhado com |
|---|---|---|---|---|---|
| E-mail | Conta, login, e-mails transacionais | Execução de contrato (V) | Supabase Auth | Até exclusão | Resend (envio), Google (se login Google) |
| Nome de exibição (opcional) | Personalização | Execução de contrato (V) | Supabase | Até exclusão | — |
| Idioma, fuso | Funcionamento | Execução de contrato (V) | Supabase | Até exclusão | — |
| Objetivos, nível, progresso, vocabulário, memória do tutor | Prestar o serviço de ensino | Execução de contrato (V) | Supabase | Até exclusão | — |
| Citações curtas do nivelamento | Explicar o resultado do nível | Execução de contrato (V) | Supabase | Até exclusão | — |
| Registros de consentimento | Comprovar consentimentos | Obrigação legal/regulatória (II) e exercício regular de direitos (VI) | Supabase | Até exclusão (ver ressalva) | — |
| Preferências de e-mail de engajamento | Enviar resumos, lembretes por e-mail | **Consentimento** (I) | Supabase | Até revogação/exclusão | Resend |
| Tokens de push | Lembretes push | Consentimento (I) | Supabase | Até revogação | Serviço de push |
| Relatos de feedback | Corrigir erros, melhorar | Legítimo interesse (IX) | Supabase | 12 meses | — |
| Logs técnicos de Auth (IP, navegador) | Segurança | Legítimo interesse (IX) | Supabase (plataforma) | Política do provedor | — |
| **Chave de API, conversas, áudio, uso de tokens** | — | **Não tratados pelo projeto** | **Só no aparelho** | Controlados pelo usuário | — |

Cuidados:
- Campos de texto livre (`goals.notes`, feedback) podem receber dados sensíveis sem querer → limite de tamanho + aviso "não inclua dados sensíveis (saúde, religião, documentos)".
- Voz é dado pessoal; não fazemos identificação biométrica. Áudio processado no aparelho (VOZ-09). Provedor de voz em nuvem só com consentimento específico (`cloud_voice_provider`).

## Direitos do titular (art. 18) → onde estão no app
| Direito | Implementação | Fase |
|---|---|---|
| Confirmação e acesso | Tela "Meus dados" + exportar JSON | F02 |
| Correção | Editar perfil, objetivos, memória do tutor | F02/F04/F05 |
| Anonimização, bloqueio, eliminação | Apagar itens (memória, vocabulário) e excluir conta | F02/F04 |
| Portabilidade | Exportar JSON legível | F02 |
| Informação sobre compartilhamento | Política de privacidade (seção operadores) | F11 |
| Revogação de consentimento | Interruptores de e-mail, push, modo sem filtro, voz em nuvem | F09/F04/F07 |
| Oposição / reclamação | Canal de contato de privacidade | F11 |

## Consentimentos (sempre opt-in, granulares, revogáveis)
| Consentimento | Quando é pedido | Padrão |
|---|---|---|
| Termos de uso + Política de privacidade | Primeiro acesso | Obrigatório para usar |
| E-mails de engajamento (por tipo) | Onboarding/Configurações | **Desligado** |
| Novidades do produto | Configurações | **Desligado** |
| Modo sem filtro | Ao ativar | **Desligado** |
| Provedor de voz em nuvem | Ao ativar | **Desligado** |

Cada mudança grava uma linha em `consent_records` com a versão do documento.

## Cookies e armazenamento
- Nenhum cookie de rastreamento, nenhum analytics de terceiros (PRIV-06).
- Só armazenamento **essencial** (sessão, cofre, dados de estudo locais). Por isso não há banner de cookies; a política descreve o armazenamento local.

## Idade
- Somente maiores de 18 anos (ADR-0010). Não direcionamos marketing a menores.
- Contexto: a LGPD (art. 14) e o ECA Digital trazem exigências adicionais para crianças e adolescentes — ficam fora do escopo enquanto o app for 18+.

## Região e transferência internacional
- Banco de produção na região **São Paulo** (PRIV-07).
- Cloudflare e Resend operam fora do Brasil → transferência internacional (art. 33). Verificar na F11 as cláusulas/garantias dos provedores e a regulamentação da ANPD sobre transferências (confirmar).

## Retenção
| Dado | Regra |
|---|---|
| Conta e progresso | Até a exclusão. Se Q-22 for aprovada: exclusão após 24 meses de inatividade, com aviso por e-mail 30 dias antes |
| `review_logs` | 24 meses (depois, agregados) |
| `feedback_reports` | 12 meses |
| `private.email_log` | 90 dias |
| `private.deletion_events` | 24 meses, sem dados identificáveis |
| Dados locais | Conforme `../dados/armazenamento-local.md` |

**Ressalva — consentimentos x exclusão de conta:** por padrão, a exclusão apaga tudo, inclusive `consent_records`. Se houver necessidade legal de guardar prova de consentimento após a exclusão, isso será decidido na F11 (guardando o mínimo, sem dados identificáveis desnecessários).

## Incidentes
- Plano em `resposta-a-incidentes.md`.
- Comunicação à ANPD e aos titulares quando o incidente puder gerar risco ou dano relevante; prazo definido em regulamento da ANPD (confirmar na F11 — referência: regulamento de comunicação de incidentes de 2024).

## Agente de pequeno porte
- Projetos pequenos podem ter obrigações simplificadas (regulamento da ANPD para agentes de pequeno porte — confirmar na F11), incluindo possível dispensa de indicar encarregado, **mantendo um canal de comunicação** com os titulares (PRIV-08).

## Documentos a produzir (F11)
1. Política de Privacidade (pt-BR, linguagem simples, versionada).
2. Termos de Uso (inclui uso aceitável e limites do modo sem filtro).
3. Aviso sobre IA: "a IA pode errar; o nível é estimativa; não é aconselhamento jurídico/imigração".
4. Página pública de solicitação de exclusão de conta (exigência das lojas).
5. Seção "Como protegemos sua chave" (transparência BYOK).
