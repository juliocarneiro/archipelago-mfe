# 03 — Module Federation a fundo

Module Federation (MF) nasceu no Webpack 5 (2020). A **versão 2.0** separou o runtime do
bundler: hoje funciona em Webpack, Rspack/Rsbuild, Vite e outros, e ganhou manifest,
runtime plugins, bridge de frameworks e devtools. Usamos o plugin do **Rsbuild** (baseado
em Rspack, escrito em Rust — builds em milissegundos).

## Remote: o que expor

`apps/catalog/rsbuild.config.ts`:

```ts
pluginModuleFederation({
  ...federationDefaults,
  name: 'catalog', // nome global do container (único na página)
  exposes: { './App': './src/export-app.tsx' },
  shared: createShared(pkg.dependencies),
});
```

O build gera:

- `mf-manifest.json` — metadados: módulos expostos, shared, assets de cada chunk.
- `static/js/catalog.[hash].js` — o **remoteEntry** (o "container").
- chunks dos módulos expostos.

**Tudo que está em `exposes` é API pública.** Renomear `./App` quebra todo host que o usa,
em produção, sem aviso de compilação. Exponha pouco.

## Host: o que consumir

`apps/shell/rsbuild.config.ts`:

```ts
remotes: {
  catalog: 'catalog@http://localhost:4001/mf-manifest.json',
  cart: 'cart@http://localhost:4002/mf-manifest.json',
},
```

A URL vem de `remoteManifest()` em `packages/mf-config`, que lê `PUBLIC_CATALOG_URL` no CI.
No código, o remote é um import dinâmico normal: `import('catalog/App')`.

**Por que manifest e não `remoteEntry.js`?** O manifest descreve os assets de antemão, o que
permite preload, devtools e o snapshot de dependências. É o formato recomendado no MF 2.0.

## `shared`: o coração (e a maior fonte de bugs)

`packages/mf-config/index.js` → `createShared()`:

```js
react: { singleton: true, requiredVersion: '^19.3.1' }
```

- **`singleton: true`** — só UMA instância na página. Obrigatório para React, react-dom,
  router e qualquer lib com estado global ou Context. Dois Reacts = "Invalid hook call".
- **`requiredVersion`** — faixa semver aceita. Se o provider oferecer uma versão fora da
  faixa, o MF avisa no console. Com `strictVersion: true`, falha.
- **Pacotes internos também são compartilhados** (`@mfe/ui`, `@mfe/contracts`): o design
  system é baixado uma vez, não três.

### Armadilha real encontrada aqui: `workspace:*`

O pnpm usa `"@mfe/ui": "workspace:*"` no package.json. O MF copiou isso literalmente para o
manifest como `requiredVersion`, que **não é semver**. `resolveRange()` no `mf-config`
traduz para `^<versão real do pacote>`. Sem isso, a checagem de versão em runtime fica cega.

## Async boundary

`apps/*/src/index.ts` contém só `import('./bootstrap')`. Por quê? O código de um app só pode
usar `react` depois que o MF decidiu **qual** React usar (o dele ou o do host). O import
dinâmico cria esse ponto de espera. Sem ele: _"Shared module is not available for eager
consumption"_.

## App-level vs component-level

**Component-level** (`apps/shell/src/remotes/CartBadge.tsx`):

```tsx
const RemoteCartBadge = lazy(() => import('cart/CartBadge'));
```

O componente roda dentro da árvore React do shell. Simples, mas exige o mesmo React (singleton)
e acopla mais (o host precisa ser React).

**App-level com Bridge** (`apps/catalog/src/export-app.tsx` + `apps/shell/src/remotes/apps.tsx`):

```tsx
// remote
export default createBridgeComponent({ rootComponent: App });
// host
const CatalogRemote = createRemoteAppComponent({ loader: () => import('catalog/App'), ... });
```

O bridge transforma o app num objeto `{ render, destroy }`. O host chama `render({ dom, ...props })`
num `<div>` e o remote cria **a própria raiz React**. Ciclo de vida explícito, erros isolados e o
host nem precisa saber que o remote é React. Use para páginas inteiras.

> Desligamos `bridge.enableBridgeRouter` (que faz alias "mágico" do react-router) e passamos o
> `basename` explícito via props. Menos mágica, contrato visível.

## Runtime plugins

`apps/shell/src/mf/platform-runtime-plugin.ts` roda no browser, dentro do runtime do MF:

- **`beforeInit`** — aplica overrides de URL de remotes lidos do `localStorage` (com allowlist
  de hosts). Permite testar o remote de um PR contra o shell de produção.
- **`errorLoadRemote`** — ponto único para telemetria de falhas de carregamento.

Outros hooks úteis: `beforeRequest`, `afterResolve`, `onLoad`, `resolveShare`, `beforeLoadShare`.

## Inspecionando no browser

Abra o console em `localhost:4000`:

```js
__FEDERATION__.__SHARE__; // quem forneceu cada dependência compartilhada
__FEDERATION__.__INSTANCES__; // containers carregados
```

Há também a extensão **Module Federation DevTools** para Chrome.

Próximo: [04 — Comunicação entre MFEs](./04-comunicacao.md)
