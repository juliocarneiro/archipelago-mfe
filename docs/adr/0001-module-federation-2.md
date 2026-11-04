# ADR-0001 — Module Federation 2.0 sobre Rsbuild para composição em runtime

- **Status:** aceito
- **Data:** 2026-11-04

## Contexto

Precisamos que times diferentes façam deploy de partes do frontend de forma independente,
compartilhando dependências pesadas (React) e mantendo uma experiência de SPA única.

## Opções consideradas

1. **Pacotes npm (build-time)** — simples, mas exige rebuild/redeploy do host a cada mudança.
2. **iframes** — isolamento total, UX ruim (modais, scroll, deep links, acessibilidade).
3. **single-spa** — maduro, mas adiciona um orquestrador; ainda precisaria de algo para compartilhar deps.
4. **Module Federation 2.0** — composição em runtime, `shared` com negociação de versões, manifest,
   runtime plugins, bridge para apps inteiros.

Bundler: Webpack (lento), Vite (`@module-federation/vite`, menos maduro), **Rsbuild/Rspack**
(compatível com o ecossistema Webpack, escrito em Rust, plugin oficial do time do MF).

## Decisão

Module Federation 2.0 com `@module-federation/rsbuild-plugin`, remotes consumidos via
`mf-manifest.json`.

## Consequências

- ✅ Deploy independente por remote; builds de milissegundos.
- ✅ Um só React na página via `shared` singleton.
- ⚠️ Versões compartilhadas precisam de governança (ADR-0005, Dependabot agrupado).
- ⚠️ Contratos não são verificados entre deploys automaticamente (ADR-0004 mitiga).
