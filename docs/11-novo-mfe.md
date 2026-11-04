# 11 — Adicionando um novo MFE

Exemplo: um MFE `account` em `/account/*`, na porta 4003.

## 1. Copie um remote existente

```bash
cp -r apps/catalog apps/account
rm -rf apps/account/dist apps/account/node_modules
```

Em `apps/account/package.json`, troque `"name"` para `@mfe/account`.

## 2. Registre porta e cor

`packages/mf-config/index.js`:

```js
export const ports = { shell: 4000, catalog: 4001, cart: 4002, account: 4003 };
```

Atualize o tipo do parâmetro de `remoteManifest`/`remoteOrigin` para incluir `'account'`.

`packages/ui/src/styles/theme.css`: adicione `--color-team-account: #...;`.

## 3. Configure o remote

`apps/account/rsbuild.config.ts`: `name: 'account'`, `server.port: ports.account`, títulos.
Mantenha `exposes: { './App': './src/export-app.tsx' }`.

## 4. Defina o contrato

`packages/contracts/src/remotes.ts`:

```ts
export type AccountAppProps = MfeAppProps;
```

Implemente `App({ basename, user }: AccountAppProps)` no novo MFE.

## 5. Ensine o shell

- `apps/shell/rsbuild.config.ts` → `remotes.account = remoteManifest('account')` e o
  `__MFE_ORIGINS__`.
- `apps/shell/src/remotes/remote-modules.d.ts` → `declare module 'account/App'`.
- `apps/shell/src/remotes/apps.tsx` → `AccountRemote` + `AccountApp` dentro de
  `<Island name="account">`.
- `apps/shell/src/router.tsx` → `{ path: 'account/*', element: <AccountApp /> }`.
- `apps/shell/src/islands/Island.tsx` → adicione `'account'` em `IslandName`.
- Nav no `Layout.tsx`.

## 6. Guard-rails

- `eslint.config.js`: adicione `../../account/**` e `@mfe/account` às importações proibidas.
- `.github/CODEOWNERS`: `/apps/account/ @your-org/account-team`.
- Um teste E2E cobrindo a rota nova.

## 7. Rode

```bash
pnpm install
pnpm dev
```

Checklist final: o MFE roda sozinho em `localhost:4003`, aparece em `localhost:4000/account`, e
com ele fora do ar o resto da plataforma continua funcionando.
