# ADR-0003 — Comunicação via event bus tipado sobre CustomEvent

- **Status:** aceito
- **Data:** 2026-11-04

## Contexto

MFEs precisam reagir a ações uns dos outros (adicionar ao carrinho, login, navegação) sem se
conhecerem.

## Opções consideradas

1. **Store global compartilhada** (Redux/Zustand singleton) — acoplamento forte; todos dependem do
   mesmo formato de estado e da mesma instância da lib.
2. **Funções expostas via MF** (`cart/addItem`) — acoplamento de chamada; se o cart cair, o catálogo quebra.
3. **CustomEvent no `window`, tipado** — nativo, agnóstico de framework, desacoplado.

## Decisão

Event bus em `@mfe/contracts` com `MfeEventMap` tipado, `publish`/`subscribe` e replay do último
valor. Regra: **um dono por estado**; outros publicam intenções.

## Consequências

- ✅ Catálogo funciona com o carrinho fora do ar.
- ✅ Funciona com MFEs em outros frameworks.
- ⚠️ Fluxo menos explícito que uma chamada de função — documente eventos no `MfeEventMap`.
- ⚠️ Eventos são contratos públicos: evoluir com versões (`.v2`), nunca quebrar.
