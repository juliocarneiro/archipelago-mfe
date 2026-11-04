# 08 — Testes

## A pirâmide em MFE

```
        ▲  E2E de composição (Playwright)   e2e/platform.spec.ts
       ▲▲  Testes de contrato (Vitest)       payload de eventos, props
     ▲▲▲▲  Unitários/componentes (Vitest)    cada MFE e pacote
```

A regra: **cada MFE é testável sozinho.** Se para testar o carrinho você precisa subir o catálogo,
os dois não são independentes de verdade.

## Unitários e de componente — Vitest + Testing Library

Cada app/pacote tem seu `vitest.config.ts` (ambiente `jsdom`). Exemplos:

- `packages/contracts/src/event-bus.test.ts` — publish/subscribe/replay.
- `apps/cart/src/store/cart-store.test.ts` — a store reage a `cart:add-requested` e publica `cart:updated`.
- `apps/shell/src/remotes/RemoteBoundary.test.tsx` — a falha de um remote não derruba a página.

## Testes de contrato

`apps/catalog/src/App.test.tsx` clica em "Add to cart" e verifica o payload publicado. Se alguém
mudar o formato do evento, o teste do **produtor** quebra antes do deploy — e o tipo de
`MfeEventMap` quebra o typecheck do **consumidor**.

Em empresas maiores, isso evolui para contract testing formal (ex.: Pact) com um broker que
registra quais versões de produtor/consumidor são compatíveis.

## E2E de composição — Playwright

`e2e/platform.spec.ts` roda contra os **builds de produção** (`pnpm preview`), testando os artefatos
reais (manifests, publicPath `auto`, CORS). Só fluxos que atravessam fronteiras:

| Teste                 | O que garante                                                 |
| --------------------- | ------------------------------------------------------------- |
| composição            | shell monta catalog e badge do cart                           |
| evento entre MFEs     | clique no catalog atualiza o badge do cart                    |
| routers sincronizados | navegação interna, navegação do shell e botão voltar          |
| resiliência           | com o catalog fora (`page.route(...abort)`), o resto funciona |
| **arquitetura**       | React, react-dom, ui e contracts têm **um único provider**    |

O último é um **teste de arquitetura**: ele protege uma propriedade do sistema (um só React), não
uma funcionalidade. Vale ouro — o bug de React duplicado costuma aparecer em silêncio, como
lentidão ou hooks quebrados meses depois.

## Rodando

```bash
pnpm test                 # todos os unitários (turbo, em paralelo, com cache)
pnpm --filter @mfe/cart test
pnpm e2e                  # builda, sobe preview e roda o Playwright
```

Próximo: [09 — Deploy e versionamento](./09-deploy-e-versionamento.md)
