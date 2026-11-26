# Armazenamento local (no aparelho)

> Tudo o que é sensível ou volumoso fica **no aparelho** (ADR-0011). Este documento define o quê, onde, por quanto tempo e como apagar.

## Onde cada coisa fica
| Dado | Web | Android/iOS (F10) | Retenção padrão | Sincroniza? |
|---|---|---|---|---|
| 🔒 Chave de API (e chaves de voz BYOK) | IndexedDB `papeai-vault`, cifrada (AES-GCM) com chave **não exportável** (+ PIN opcional) | Keystore/Keychain via plugin de armazenamento seguro | Até o usuário remover | **Nunca** |
| Sessão do Supabase (JWT + refresh) | Adaptador de armazenamento próprio em IndexedDB (avaliar na F02 x padrão do supabase-js) | Armazenamento seguro | Até sair | Não |
| Transcrições das conversas | IndexedDB `conversations` | IndexedDB no WebView (ou SQLite, decidir na F10) | 90 dias (configurável: 7/30/90/sempre) | Não (backlog BL-04) |
| Transcrição do nivelamento | IndexedDB `placement_transcripts` | idem | 90 dias | Não |
| Gravações de áudio | Memória; opcionalmente últimas 20 em IndexedDB para "ouvir de novo" | idem | 7 dias | **Nunca** |
| Registro de uso de tokens | IndexedDB `usage_ledger` | idem | 12 meses | Não |
| Cache de lições geradas | IndexedDB `lesson_cache` | idem | 30 dias ou até mudar a versão do prompt | Não |
| Fila de sincronização | IndexedDB `sync_queue` | idem | Até enviar | — |
| Preferências locais (tema, volume) | IndexedDB `settings` | idem | — | Parcial (as do servidor) |
| Modelos de voz baixados | Cache Storage / OPFS | Sistema de arquivos do app | Até o usuário remover | Não |
| Arquivos do app (PWA) | Cache Storage (service worker) | Pacote do app | Versão atual | — |

**Proibido:** guardar a chave de API, tokens de sessão ou transcrições em `localStorage`, cookies, URL, `sessionStorage` sem cifra, ou em qualquer log.

## Esquema do IndexedDB (Dexie) — planejado
```ts
// app/src/core/data/local-db.ts — esboço (F03/F04)
db.version(1).stores({
  conversations:        'id, userId, learningProfileId, startedAt',
  messages:             'id, conversationId, createdAt',
  placement_transcripts:'id, userId, createdAt',
  usage_ledger:         'id, userId, createdAt, route, model',
  lesson_cache:         'key, userId, promptVersion, createdAt',
  sync_queue:           '++seq, userId, table, createdAt',
  settings:             'key',
});
// 'papeai-vault' é um banco SEPARADO, acessado só por core/vault.
```
- Cada registro carrega `userId`: trocar de conta no mesmo aparelho não mistura dados.
- Mudanças de schema local usam `db.version(n).upgrade(...)` e são registradas em `changelog-do-schema.md` (seção "local").

## Ciclo de vida
| Evento | O que acontece |
|---|---|
| Login | Carrega dados do servidor; dados locais de **outro** usuário ficam inacessíveis (filtrados por `userId`). |
| Sair (logout) | Diálogo: "Apagar também minha chave de API deste aparelho?" — **marcado por padrão**. Sessão sempre apagada. Opção de apagar conversas locais. |
| Excluir conta | Apaga tudo: cofre, conversas, áudio, uso, cache, fila. |
| Trocar de aparelho | Progresso vem do servidor; a chave precisa ser colada de novo (por design). |
| Limpeza automática | Ao abrir o app: remove o que passou da retenção. |

## Persistência e cotas
- Pedir `navigator.storage.persist()` após o login, para o navegador não apagar dados sob pressão de espaço.
- Mostrar em Configurações → "Armazenamento": espaço usado por categoria, com botões de limpar.
- Modelos de voz grandes: baixar só com confirmação e de preferência em Wi-Fi (VOZ-13).

## Offline
| Recurso | Funciona offline? |
|---|---|
| Revisão espaçada (FSRS) | Sim — cálculo local; sincroniza depois |
| Ler conversas antigas | Sim |
| Conversar com o tutor | Não (precisa da API); mensagem clara e botão "tentar de novo" |
| Lições já geradas e em cache | Parcialmente (atividades sem IA) |
| Avaliação de pronúncia local | Sim, se o modelo já foi baixado (F07) |
