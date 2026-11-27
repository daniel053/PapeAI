# Estrutura de pastas e módulos

## Árvore planejada do repositório
```text
PapeAI/
├─ CLAUDE.md                  # roteador da IA
├─ README.md                  # entrada para humanos
├─ SECURITY.md                # política de segurança (F01)
├─ LICENSE                    # (F00, após ADR-0005)
├─ docs/                      # toda a documentação
├─ app/                       # o aplicativo (web → Capacitor)
│  ├─ index.html
│  ├─ public/
│  │  ├─ robots.txt           # Disallow: /  (app nunca indexado)
│  │  ├─ _headers             # CSP e cabeçalhos (Cloudflare)
│  │  ├─ .well-known/security.txt
│  │  ├─ manifest.webmanifest
│  │  ├─ fonts/               # fontes self-hosted
│  │  └─ models/              # mascote.glb e afins
│  ├─ src/
│  │  ├─ app/                 # bootstrap, rotas, providers, guards
│  │  ├─ features/            # telas por funcionalidade
│  │  │  ├─ auth/  onboarding/  placement/  lesson/  review/
│  │  │  ├─ chat/  progress/  settings/  api-key/  my-data/
│  │  ├─ core/                # regras sem interface
│  │  │  ├─ vault/            # 🔒 ÚNICO lugar que guarda/lê a chave
│  │  │  ├─ net/              # 🔒 guarda de rede (allowlist)
│  │  │  ├─ llm/              # cliente do provedor de IA (usa o vault)
│  │  │  ├─ tutor/            # prompts, schemas, validação, memória
│  │  │  │  └─ prompts/       # tutor.v1.md, placement.v1.md ... (versionados)
│  │  │  ├─ learning/         # trilha, FSRS, XP, streak, agregador do nivelamento
│  │  │  ├─ speech/           # captura, ASR, TTS, pronúncia, prosódia
│  │  │  ├─ data/             # cliente Supabase, repositórios, sync, Dexie
│  │  │  ├─ auth/             # sessão, eventos de login
│  │  │  ├─ usage/            # contabilidade de tokens e limites de gasto
│  │  │  └─ i18n/
│  │  ├─ mascot/              # cena 3D, estados, animações
│  │  ├─ platform/            # adaptadores web x nativo
│  │  │  ├─ web/  native/
│  │  ├─ ui/                  # design system
│  │  └─ config/              # modelos, limites, allowlist (versionados)
│  ├─ tests/                  # e2e (Playwright)
│  └─ android/                # gerado pelo Capacitor (F10)
├─ site/                      # site institucional (estático, indexável)
├─ supabase/
│  ├─ config.toml
│  ├─ migrations/             # SQL numerado — nunca editar migração aplicada
│  ├─ functions/              # Edge Functions (delete-account, export-data, send-email, weekly-summary...)
│  ├─ tests/                  # testes de RLS
│  └─ seed.sql                # dados FICTÍCIOS para desenvolvimento
├─ content/                   # conteúdo pedagógico (CC BY-SA, ver ADR-0005)
│  ├─ languages/en/           # currículo, vocabulário, fonemas, erros típicos (l1/pt-BR)
│  └─ themes/                 # profession.*, country.*, travel.*
├─ evals/                     # casos de teste dos prompts + resultados
├─ art/mascot/                # fontes do Blender, conceitos, scripts de exportação
└─ .github/                   # workflows, dependabot, templates de PR/issue
```

## Regras de dependência entre módulos (impostas pelo lint)
| Módulo | Pode importar | Não pode importar |
|---|---|---|
| `core/vault` | WebCrypto, `platform/*` (armazenamento seguro) | nada de rede, nada de UI, nada de log externo |
| `core/net` | — | `core/vault` |
| `core/llm` | `core/vault`, `core/net`, `core/usage`, `config` | `features/*`, `core/data` |
| `core/speech/providers/*` (BYOK) | `core/vault`, `core/net` | `features/*` |
| `core/tutor` | `core/llm`, `core/learning`, `config` | `core/vault` diretamente |
| `core/data` | `@supabase/supabase-js`, Dexie, `core/net` | `core/vault`, `core/llm` |
| `features/*` | `core/*` (exceto `vault` e `net`), `ui`, `mascot`, `platform` | `@supabase/supabase-js` direto, `core/vault` (exceção: `features/api-key` usa só `setKey/removeKey/hasKey/fingerprint`) |
| `ui`, `mascot` | `config` | `core/*` de dados |

Implementação (F01): regra local `papeai/restricted-modules` em `tooling/eslint-plugin-papeai.js`, ligada em `eslint.config.js`, + teste `app/src/security-lint.test.ts` que falha se a regra for removida.
- **Por que regra local e não `no-restricted-imports`:** a regra padrão compara só o texto do import. Um import "irmão" como `'../vault'` (de dentro de `core/tutor`) não contém `core/vault` e passava despercebido — o teste pegou essa brecha. A regra local resolve o caminho real a partir do arquivo antes de comparar. Sem dependência nova.
- Também cobertos: `import type`, `export * from`, `import()` dinâmico e aliases do tipo `@/core/vault`.
- Rede: fora de `core/net`, o lint proíbe `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `window.fetch`/`globalThis.fetch` e `navigator.sendBeacon`; o app usa `appFetch` (`app/src/app/network.ts`).
- Exceção de `features/api-key` (só `setKey/removeKey/hasKey/fingerprint`): configurar na F03, junto com o cofre.

## API pública do cofre (contrato)
```ts
// app/src/core/vault/index.ts  — contrato (implementação na F03)
export type ProviderId = 'anthropic' | 'azure-speech' /* | ... */;

export interface Vault {
  hasKey(provider: ProviderId): Promise<boolean>;
  setKey(provider: ProviderId, key: string): Promise<void>;   // valida formato, cifra, guarda
  removeKey(provider: ProviderId): Promise<void>;             // apaga de verdade
  fingerprint(provider: ProviderId): Promise<string | null>;  // ex.: "…a1B2" — nunca a chave
  // A chave só existe dentro do callback e só para o domínio fixo do provedor:
  withKey<T>(provider: ProviderId, fn: (key: string) => Promise<T>): Promise<T>;
}
// Não existe getKey(). Não existe exportação. Não existe log.
```

## Adaptadores de plataforma (o segredo da migração web → mobile)
| Interface | Web (F01–F09) | Android/iOS (F10+) |
|---|---|---|
| `SecureStore` | IndexedDB + AES-GCM com chave não exportável (+ PIN opcional) | Keystore/Keychain via plugin de armazenamento seguro |
| `Notifications` | Notificações web (quando instalada como PWA) | `@capacitor/local-notifications` / push |
| `Microphone` | `getUserMedia` | permissão nativa + `getUserMedia` no WebView |
| `AuthRedirect` | redirecionamento OAuth PKCE | login nativo do Google → `signInWithIdToken` |
| `AppLifecycle` | `visibilitychange` | `@capacitor/app` |

As telas e o `core/` não sabem em qual plataforma estão: recebem o adaptador certo na inicialização. Por isso a F10 é "embrulhar", não reescrever.

## Convenções
- Arquivos e pastas em inglês, `kebab-case`; componentes React em `PascalCase`.
- Um módulo expõe só o seu `index.ts`; imports internos de outro módulo são proibidos.
- Configuração sensível ao comportamento (modelos, limites, allowlist) em `app/src/config/`, versionada e revisada em PR.
- Prompts são arquivos versionados (`tutor.v1.md` → `tutor.v2.md`), nunca strings soltas no código.
