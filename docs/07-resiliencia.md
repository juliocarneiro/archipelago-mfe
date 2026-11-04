# 07 — Resiliência

Num monolito, o deploy é tudo ou nada. Em MFE, cada remote é um sistema separado que **pode estar
fora do ar enquanto o resto funciona**. Isso é uma vantagem — mas só se a plataforma for construída
para isso. Por padrão, não é.

## O bug que derrubava a página inteira

Construindo este projeto, simulamos o catálogo fora do ar. Resultado: **página em branco**. Nem o
header aparecia.

Causa: a estratégia padrão de compartilhamento do MF é `shareStrategy: 'version-first'`. No boot,
ela baixa o manifest de **todos** os remotes para descobrir qual tem a maior versão de cada
dependência compartilhada. Se um remote não responde, a inicialização do `shared` falha — e como
o próprio shell depende do React compartilhado, nada renderiza.

Correção (`packages/mf-config/index.js` → `federationDefaults`):

```js
export const federationDefaults = { shareStrategy: 'loaded-first' /* ... */ };
```

Agora o shell usa o que já tem carregado e só busca um remote quando ele é realmente usado. Leia
o [ADR-0005](./adr/0005-loaded-first-sharing.md). Há um teste E2E que garante isso.

## Camadas de proteção

```
falha de rede / CDN  ──►  runtime plugin (errorLoadRemote): log + telemetria
                     ──►  bridge fallback / RemoteBoundary: UI de erro só naquela ilha
erro de render       ──►  RemoteBoundary (Error Boundary do React)
widget no header     ──►  compactFallback (placeholder discreto, não quebra o layout)
```

- `apps/shell/src/remotes/RemoteBoundary.tsx` — Error Boundary + Suspense por remote, com
  "Try again" que remonta o componente (`key` incrementada).
- `apps/shell/src/remotes/apps.tsx` — `fallback` do bridge para erros de carregamento de app-level.
- `apps/shell/src/mf/platform-runtime-plugin.ts` — `errorLoadRemote` centraliza o log.

## Faça o teste você mesmo

1. `pnpm dev`, abra `localhost:4000/catalog`.
2. No terminal, mate só o catalog (ou, no console do browser:
   `localStorage.setItem('mfe:overrides', JSON.stringify({ catalog: 'http://localhost:4999/mf-manifest.json' }))`
   e recarregue).
3. O bloco do catálogo mostra o erro; header, login, carrinho e badge continuam funcionando.
4. `localStorage.removeItem('mfe:overrides')` para voltar.

## Indo além (produção)

- **Telemetria por ilha:** mande erros com tag `mfe:<nome>` para o Sentry/Datadog — assim o alerta
  vai para o time dono, não para a plataforma.
- **Retry com backoff:** `@module-federation/retry-plugin` tenta de novo buscar manifest/chunks.
- **Timeout:** um remote lento é pior que um remote fora do ar. Considere um timeout no loader.
- **Feature flag / kill switch:** poder desligar um remote problemático sem deploy do shell.

Próximo: [08 — Testes](./08-testes.md)
