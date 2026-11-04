# 09 — Deploy e versionamento

O objetivo final de MFE é **deploy independente**: o time do carrinho lança na terça às 15h sem
falar com ninguém. Isto é o que precisa estar certo para isso funcionar.

## Topologia

```
https://app.suaempresa.com            → shell   (CDN / bucket próprio)
https://catalog.cdn.suaempresa.com    → catalog (CDN / bucket próprio)
https://cart.cdn.suaempresa.com       → cart    (CDN / bucket próprio)
```

Cada app tem **seu pipeline, seu bucket, seu rollback**. O monorepo é só onde o código mora.

## Build do shell apontando para os remotes

```bash
PUBLIC_CATALOG_URL=https://catalog.cdn.suaempresa.com \
PUBLIC_CART_URL=https://cart.cdn.suaempresa.com \
pnpm --filter @mfe/shell build
```

`remoteManifest()` em `packages/mf-config` monta `catalog@https://.../mf-manifest.json`.

Para **não precisar rebuildar o shell nem para mudar URLs**, o próximo passo é service discovery:
o shell baixa um JSON (`/remotes.json` servido por um serviço ou pelo CDN) no boot e registra os
remotes com `registerRemotes()` do runtime do MF. Este boilerplate deixa isso como evolução.

## Cache: o detalhe que mais derruba deploy

| Arquivo                        | Cache                             | Por quê                                          |
| ------------------------------ | --------------------------------- | ------------------------------------------------ |
| `mf-manifest.json`             | `no-cache` (ou max-age bem curto) | é o ponteiro para a versão atual                 |
| `index.html` do shell          | `no-cache`                        | mesmo motivo                                     |
| `static/**` (com hash no nome) | `max-age=31536000, immutable`     | nome muda a cada build; pode cachear para sempre |

Se o manifest ficar cacheado por 1 dia, seu deploy demora 1 dia para chegar — e seu rollback também.

## CORS e publicPath

- O shell (outra origem) busca os arquivos dos remotes: o CDN do remote precisa liberar a origem do
  shell. Em dev, `server.cors` usa `allowedOrigins` do `mf-config`.
- `output.assetPrefix: 'auto'` nos remotes faz os chunks serem resolvidos a partir da URL de onde o
  remoteEntry veio. Sem isso, o shell tentaria buscar os chunks do catálogo **no domínio do shell**.

## Rollback

Como os assets têm hash e são imutáveis, rollback = **apontar o manifest para o build anterior**
(republicar o `mf-manifest.json` antigo, ou trocar o alias no CDN). Segundos, sem rebuild.

## Versionando dependências compartilhadas

- React e afins sobem **juntos** em todos os apps (Dependabot agrupa em `runtime-shared`).
- Durante a transição de uma major, use `requiredVersion` com faixa ampla e teste a matriz
  host-novo × remote-velho e host-velho × remote-novo.
- `@mfe/ui` e `@mfe/contracts` seguem semver de verdade: breaking change = major. Com
  `requiredVersion: '^1.0.0'`, um remote antigo não aceita silenciosamente um `ui@2`.

## Testando um remote de PR contra produção

O runtime plugin do shell aceita overrides:

```js
localStorage.setItem(
  'mfe:overrides',
  JSON.stringify({
    catalog: 'https://pr-123.catalog.preview.suaempresa.com/mf-manifest.json',
  }),
);
```

Em produção, mantenha a allowlist de hosts (`ALLOWED_OVERRIDE_HOSTS`) restrita aos seus domínios de
preview — senão qualquer um carregaria código arbitrário na sua página.

## CI

`.github/workflows/ci.yml`: format → lint → typecheck + test + build (Turborepo com cache) → E2E
contra os builds. Para monorepos grandes, use `turbo run build --affected` para buildar só o que
mudou, e um pipeline de deploy **por app** disparado quando a pasta dele muda.

Próximo: [10 — Armadilhas comuns](./10-armadilhas.md)
