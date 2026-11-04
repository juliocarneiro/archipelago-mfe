# Contributing

Thanks for helping improve Archipelago.

## Setup

```bash
corepack enable
pnpm install
pnpm dev
```

## Before opening a PR

```bash
pnpm verify   # lint + typecheck + unit tests + build
pnpm e2e      # cross-island tests against production builds
```

## Ground rules

- **Apps never import from other apps.** Integrate through Module Federation or `packages/*`.
  ESLint enforces this.
- **Contracts are public APIs.** Do not remove or rename exposed modules, props or event fields.
  Add a new version alongside the old one (see `docs/05-contratos-e-tipagem.md`).
- **One owner per piece of state.** Other islands publish intents, never mutate.
- **Remotes do not ship global CSS.** No preflight, no element selectors in federated CSS.
- Record significant decisions as an ADR in `docs/adr/`.
