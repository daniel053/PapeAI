# Idiomas extensíveis (inglês primeiro, código aberto a outros)

## Duas coisas diferentes
| Conceito | Exemplo | Onde mora |
|---|---|---|
| **Idioma da interface** | Botões em português ou inglês | `app/src/core/i18n/locales/pt-BR.json`, `en.json` |
| **Idioma-alvo** | O idioma que a pessoa estuda | `content/languages/<codigo>/` + tabelas `languages`/`language_variants` |
| **Idioma nativo** | O idioma das explicações | `profiles.native_language` + catálogos `l1/<idioma>.json` |

## Pacote de idioma (`content/languages/<codigo>/`)
```text
content/languages/en/
├─ manifest.json             # código, nome, variantes, status
├─ syllabus.json             # programa por nível (gramática, funções, can-do)
├─ vocabulary/               # listas por nível, com licença e fonte de cada lista
├─ placement/questions.json  # banco de perguntas do nivelamento
├─ phonology/
│  ├─ phonemes.json          # inventário de fonemas por variante
│  └─ lexicon-sources.md     # dicionários de pronúncia usados (licenças!)
├─ l1/pt-BR.json             # erros típicos de quem tem português como língua nativa
├─ fallback-lessons/         # lições curadas de reserva
└─ voices.json               # vozes TTS preferidas por variante e plataforma
```

### `manifest.json` (exemplo)
```json
{
  "code": "en",
  "name": { "pt-BR": "Inglês", "en": "English" },
  "variants": [
    { "code": "en-US", "name": { "pt-BR": "Inglês americano" } },
    { "code": "en-GB", "name": { "pt-BR": "Inglês britânico" } },
    { "code": "en-AU", "name": { "pt-BR": "Inglês australiano" } }
  ],
  "status": "active",
  "content_license": "CC-BY-SA-4.0"
}
```

## Regras de código (valem desde a F01)
1. Nenhum texto "English"/"inglês" fixo na lógica: tudo vem do pacote ou do i18n.
2. Prompts recebem `{targetLanguage}`, `{variant}`, `{nativeLanguage}` como variáveis.
3. Schemas e tabelas usam códigos genéricos (`target_language`, `accent_variant`).
4. O motor de fala recebe o idioma/variante como parâmetro (modelos e fonemas por idioma).
5. Ordenação, plural e datas via `Intl` e i18next (não "na mão").

## Checklist para habilitar um idioma novo
- [ ] `manifest.json`, `syllabus.json` e listas de vocabulário com licença compatível.
- [ ] Banco de perguntas do nivelamento e rubrica revisados.
- [ ] Catálogo `l1/pt-BR.json` (erros típicos de brasileiros naquele idioma).
- [ ] Vozes TTS disponíveis (local e/ou BYOK) para as variantes.
- [ ] Modelo de reconhecimento/fonemas avaliado para o idioma (F07).
- [ ] Evals adaptadas (correções, variantes, nivelamento).
- [ ] Linha em `languages` (`enabled = true`) via migração.
- [ ] Fontes com suporte aos caracteres do idioma.

## Candidatos futuros (F12)
| Idioma | Atenções específicas |
|---|---|
| Espanhol (es-ES, es-MX...) | Falsos cognatos com português são o maior risco |
| Francês | Vogais nasais e liaison na pronúncia |
| Italiano | Proximidade com português (interferência) |
| Alemão | Casos gramaticais, gênero |
| Japonês | Escrita não latina, entrada de texto (IME), fontes, sistema de níveis próprio |

## Outros idiomas nativos (além do português)
- Interface em inglês já prevista.
- Explicações no idioma nativo configurado; catálogos `l1/<idioma>.json` adicionais.
