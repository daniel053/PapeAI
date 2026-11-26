# Ambiente de desenvolvimento (Windows)

> Comandos em **PowerShell**. IDs de pacotes do `winget` e comandos de instalação: **confirmar com `winget search <nome>` e na documentação oficial** antes de rodar (regra anti-alucinação).

## ⚠️ OneDrive (Q-12)
> **Decisão do dono (2026-11-26):** a sincronização do OneDrive está **desativada** nesta máquina, então o repositório fica onde está (risco aceito por escrito). Os problemas abaixo só voltam se a sincronização for reativada — nesse caso, mover o repositório antes.

Hoje o projeto está em `C:\Users\dermi\OneDrive\Documents\repositorios\PapeAI`. Problemas:
1. O OneDrive tenta sincronizar `node_modules` (dezenas de milhares de arquivos) → lentidão e conflitos.
2. Arquivos travados durante builds/instalações causam erros aleatórios.
3. Arquivos locais com segredos (ex.: `.env.local`) iriam para a nuvem do OneDrive.

**Como mover (com o VS Code e o Claude Code fechados nesta pasta):**
```powershell
New-Item -ItemType Directory -Force C:\dev
```
```powershell
Move-Item -Path "C:\Users\dermi\OneDrive\Documents\repositorios\PapeAI" -Destination "C:\dev\PapeAI"
```
Depois, abrir uma **nova sessão** do Claude Code em `C:\dev\PapeAI` e dizer "continuar". Conferir com `git status` que está tudo lá.

## O que instalar (F00)
| Ferramenta | Para quê | Instalação sugerida | Verificar |
|---|---|---|---|
| Git | Versionamento | `winget install --id Git.Git -e` | `git --version` |
| Node.js **LTS vigente** | Rodar ferramentas JS | Máquina do dono: **nvm-windows** (várias versões convivem): `nvm install 26.13.1` e depois `nvm use 26.13.1`. ⚠️ `nvm use` troca a versão para o PC inteiro; para os projetos antigos, `nvm use 11.15.0`. Sem nvm: `winget install --id OpenJS.NodeJS.LTS -e` (confirmar a LTS atual em nodejs.org) | `node -v` |
| pnpm | Gerenciador de pacotes | `npm install -g pnpm@<versão>` (o Node 26 não traz mais o Corepack; verificado: a pasta `corepack` existe no Node 24 e não existe no 26). Instalações globais ficam separadas por versão do Node no nvm-windows | `pnpm -v` |
| VS Code | Editor | `winget install --id Microsoft.VisualStudioCode -e` | abre |
| GitHub CLI | PRs, issues | `winget install --id GitHub.cli -e` (instalado em 2026-11-26: **2.106.0**, hash do instalador verificado pelo winget) | `gh --version` |

Extensões do VS Code: ESLint, Prettier, Tailwind CSS IntelliSense, Playwright Test, EditorConfig.

## Configurações úteis do Git no Windows
```powershell
git config --global core.longpaths true
```
```powershell
git config --global core.autocrlf false
```
(Finais de linha ficam padronizados em LF pelo `.gitattributes` do repositório.)

## Quando cada fase pedir
| Fase | Ferramenta | Observação |
|---|---|---|
| F01 | Conta Cloudflare (MFA) | Hospedagem |
| F02 | Supabase CLI | Via Scoop ou como dependência de desenvolvimento do projeto (confirmar o método recomendado para Windows) |
| F02 (opcional) | Docker Desktop | Só se Q-13 = sim (Supabase local); exige WSL2 e bastante RAM |
| F07 | — | Testes de voz no celular real (microfone) |
| F08 | Blender | Modelagem do mascote; MCP do Blender disponível no ambiente |
| F10 | Android Studio + SDK | Build e instalação do app; depuração USB no celular |

## Problemas comuns
| Sintoma | Causa provável | Solução |
|---|---|---|
| "a execução de scripts foi desabilitada neste sistema" | Política de execução do PowerShell bloqueando atalhos `.ps1` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (entender o que faz antes de aplicar) |
| Erros "EPERM"/"EBUSY" ao instalar | Arquivos travados (OneDrive/antivírus/editor) | Mover para fora do OneDrive; fechar processos que usam a pasta |
| Caminho longo demais | Limite de caminho do Windows | `git config --global core.longpaths true`; pasta curta (`C:\dev`) |
| Porta em uso | Outro servidor rodando | Fechar o processo ou trocar a porta |

## Segredos no ambiente local
- `.env.local` só para valores de desenvolvimento **não sensíveis** (ex.: URL do projeto Supabase de dev, chave pública).
- A chave de API de desenvolvimento é colada **no app** (cofre), não em arquivos.
- `.env*` no `.gitignore` desde a F00.
