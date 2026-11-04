# 10 — Armadilhas comuns

Os itens marcados com ★ aconteceram de verdade durante a construção deste projeto.

### ★ Página inteira em branco quando um remote cai

**Sintoma:** um remote fora do ar e nem o header do shell renderiza.
**Causa:** `shareStrategy: 'version-first'` (padrão) baixa todos os manifests no boot.
**Correção:** `shareStrategy: 'loaded-first'`. [Capítulo 07](./07-resiliencia.md).

### ★ `requiredVersion: "workspace:*"` no manifest

**Sintoma:** nenhum aviso de versão incompatível, mesmo quando deveria haver.
**Causa:** o protocolo `workspace:` do pnpm não é semver; o MF copia literalmente.
**Correção:** `resolveRange()` em `packages/mf-config/index.js` traduz para `^<versão>`.

### ★ Plugin aplicando alias "mágico" no react-router

**Sintoma:** log `bridgeRouterAlias` no build e um react-router diferente do que você importou.
**Causa:** com `@module-federation/bridge-react` instalado, o plugin troca o `react-router` por um
wrapper que injeta basename.
**Correção:** `bridge: { enableBridgeRouter: false }` e basename explícito via props.

### ★ Router do shell e do remote dessincronizados

**Sintoma:** clicar em "Catalog" no header estando em `/catalog/p/1` não volta para a lista.
**Causa:** `pushState` de um router não notifica o outro.
**Correção:** `notifyLocationChange()` (`packages/contracts/src/history-sync.ts`).

### ★ Porta ocupada por outro projeto

**Sintoma:** o shell sobe, mas `localhost:4000` mostra outro app.
**Causa:** outro servidor escutando em IPv4 na mesma porta enquanto o Rsbuild escuta em IPv6.
**Correção:** portas centralizadas em `mf-config` (`ports`). Troque num lugar só.

### "Invalid hook call" / dois Reacts

**Causa:** `react` sem `singleton: true` em algum app, ou versões fora da faixa.
**Diagnóstico:** `__FEDERATION__.__SHARE__` no console — veja `from` de cada versão.
**Prevenção:** `createShared()` único para todos + teste E2E de arquitetura.

### "Shared module is not available for eager consumption"

**Causa:** falta o async boundary (`index.ts` → `import('./bootstrap')`).

### Chunks do remote dando 404 no domínio do shell

**Causa:** `publicPath`/`assetPrefix` absoluto errado ou ausente.
**Correção:** `output.assetPrefix: 'auto'` nos remotes.

### CORS em produção

**Causa:** CDN do remote não libera a origem do shell. Funciona em dev e quebra em staging.
**Correção:** configure `Access-Control-Allow-Origin` no CDN de cada remote.

### CSS de um MFE quebrando outro

**Causa:** reset global ou seletores de elemento (`button { ... }`) num remote.
**Correção:** remotes sem preflight, só utilities/escopo. [Capítulo 06](./06-estilos-e-css.md).

### Chave de `localStorage` colidindo

**Causa:** dois MFEs usando `cart` ou `token` como chave na mesma origem.
**Correção:** namespace sempre: `mfe:<app>:<chave>:v<n>`.

### O "shared" que virou monolito

**Sintoma:** todo PR mexe em `packages/contracts`; nenhum time consegue lançar sozinho.
**Causa:** regra de negócio migrou para o pacote compartilhado.
**Correção:** em pacotes compartilhados, só tipos de fronteira, eventos e infraestrutura.

Próximo: [11 — Adicionando um novo MFE](./11-novo-mfe.md)
