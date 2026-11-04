# ADR-0002 — Um monorepo, deploys independentes

- **Status:** aceito
- **Data:** 2026-11-04

## Contexto

MFEs podem viver em repositórios separados (polyrepo) ou num só (monorepo). Deploy independente
não exige repositórios independentes.

## Decisão

Monorepo com **pnpm workspaces** + **Turborepo**. Cada app tem build e deploy próprios; pacotes
internos (`contracts`, `ui`, `mf-config`) são consumidos como fonte (Just-in-Time packages).

## Consequências

- ✅ Mudança de contrato e de consumidores no mesmo PR, com typecheck de tudo.
- ✅ Tooling único (lint, TS, testes); cache do Turborepo deixa o CI rápido.
- ✅ Fácil de estudar e de clonar como boilerplate.
- ⚠️ É tentador importar código de outro app — bloqueado por `no-restricted-imports` no ESLint.
- ⚠️ Com muitos times, considere `turbo --affected` e pipelines de deploy por pasta.
- 🔁 Se um MFE precisar sair para outro repo, o contrato em `@mfe/contracts` vira pacote publicado.
