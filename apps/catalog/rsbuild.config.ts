import { readFileSync } from 'node:fs';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { allowedOrigins, createShared, ports, federationDefaults, fontTags } from '@mfe/mf-config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/**
 * CATALOG — remote "app-level".
 * Expõe uma APLICAÇÃO inteira (com router próprio) para o shell montar em /catalog/*.
 */
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      ...federationDefaults,
      // `name` vira o identificador global do container. Precisa ser único na página
      // e igual à chave usada no `remotes` do shell.
      name: 'catalog',
      exposes: {
        // Tudo que é exposto é API PÚBLICA. Exponha pouco e com contrato estável.
        './App': './src/export-app.tsx',
      },
      shared: createShared(pkg.dependencies),
    }),
  ],
  server: {
    port: ports.catalog,
    // Remote é buscado por OUTRA origem (o shell). Libere só quem é confiável.
    cors: { origin: allowedOrigins },
  },
  // 'auto' = os chunks são resolvidos relativos à URL de onde o remoteEntry foi
  // baixado. Essencial: o shell roda em outra origem e precisa buscar os chunks
  // do catálogo no servidor/CDN do catálogo, não no dele.
  dev: { assetPrefix: 'auto' },
  output: {
    assetPrefix: 'auto',
  },
  html: { title: 'catalog · standalone', tags: fontTags },
});
