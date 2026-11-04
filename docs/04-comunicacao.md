# 04 — Comunicação entre MFEs

A pergunta mais comum em MFE é "como compartilho estado?". A melhor resposta quase sempre é:
**compartilhe o mínimo possível.** Cada pedaço de estado tem **um único dono**.

## Props down, events up

| Direção         | Mecanismo                     | Exemplo no projeto                                 |
| --------------- | ----------------------------- | -------------------------------------------------- |
| shell → remote  | **props** (contrato)          | `basename` e `user` em `MfeAppProps`               |
| remote → mundo  | **eventos** (fatos/intenções) | catálogo publica `cart:add-requested`              |
| dono → leitores | **evento com replay**         | carrinho publica `cart:updated`                    |
| remote → shell  | **evento de pedido**          | carrinho pede `shell:navigate` para ir ao catálogo |

## O event bus

`packages/contracts/src/event-bus.ts` — ~50 linhas sobre `CustomEvent` no `window`:

```ts
publish('cart:add-requested', { product, quantity: 1 });
const off = subscribe('cart:updated', (detail) => ..., { replay: true });
```

Por que não Redux/Zustand global?

- **Agnóstico de framework:** um MFE em Vue escuta `window` igual.
- **Não depende de a lib ser singleton:** mesmo que o MF falhe em compartilhar o pacote,
  só existe um `window`.
- **Tipado:** `MfeEventMap` (em `events.ts`) define nome → payload. Publicar um payload
  errado é erro de compilação.
- **Replay:** o badge pode montar _depois_ do carrinho publicar seu estado. Guardamos o último
  payload por evento; `{ replay: true }` entrega na hora.

### Intenção vs fato

- `cart:add-requested` é uma **intenção**. O catálogo não sabe se o carrinho existe — e se o
  carrinho estiver fora do ar, o catálogo continua funcionando.
- `cart:updated` é um **fato**, publicado **só** pelo dono do estado.

Se você vê um MFE publicando fato sobre o domínio de outro, a fronteira está errada.

## Estado do carrinho

`apps/cart/src/store/cart-store.ts`: store mínima com `useSyncExternalStore`. Como módulos ES
são singletons por container, o `CartBadge` (no header) e o `App` (página) leem a **mesma**
instância — ambos vêm do remote `cart`.

Persistência em `localStorage` com chave **namespaced** (`mfe:cart:v1`): todos os MFEs vivem na
mesma origem e dividem o mesmo storage. Prefixe sempre.

## Roteamento entre routers

O problema menos óbvio de app-level remotes:

- O shell tem um router (`createBrowserRouter`) que sabe só os prefixos: `/catalog/*`, `/cart/*`.
- O catálogo tem **o próprio** `BrowserRouter` com `basename="/catalog"`.
- Os dois leem a mesma URL, mas `history.pushState` **não emite evento**. Quando o catálogo
  navega para `/catalog/p/1`, o router do shell não fica sabendo (e vice-versa).

Solução em `packages/contracts/src/history-sync.ts`: depois de cada navegação, quem navegou
dispara um `popstate` sintético. Todo router do planeta escuta `popstate`. Um guard por `href`
evita loop. Cada app chama `notifyLocationChange()` num effect que observa a location.

Navegação **para fora do próprio domínio** (carrinho → catálogo) não é feita pelo remote: ele
publica `shell:navigate` e o shell executa. Assim o remote não precisa conhecer as rotas dos
outros.

## Autenticação

O shell é dono da sessão e passa `user` por props. Em produção:

- Token em **cookie httpOnly**; cada MFE chama sua API com `credentials: 'include'`.
- **Nunca** coloque o token em `window` ou `localStorage` para "compartilhar" com MFEs —
  qualquer script de terceiro na página lê.

Próximo: [05 — Contratos e tipagem](./05-contratos-e-tipagem.md)
