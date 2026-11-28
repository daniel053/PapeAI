# core/vault — cofre da chave de API

🔒 Único lugar do código que guarda e lê a chave de API do usuário. Implementação na **F03**.

- Contrato da API pública: `docs/arquitetura/estrutura-de-pastas-e-modulos.md` ("API pública do cofre").
- Regras: `docs/seguranca/cofre-da-chave-api.md`.
- A regra de lint que impede outros módulos de importar esta pasta já está ativa (F01) e é verificada por `app/src/security-lint.test.ts`.
