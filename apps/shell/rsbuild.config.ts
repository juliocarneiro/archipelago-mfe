import { readFileSync } from 'node:fs';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import {
  createShared,
  federationDefaults,
  fontTags,
  ports,
  remoteManifest,
  remoteOrigin,
} from '@mfe/mf-config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/**
 * SHELL (host / container app).
 * Responsabilidades — e SÓ estas:
 *  - Layout global (header, nav), roteamento de topo (/catalog/*, /cart/*).
 *  - Autenticação/sessão e repasse do usuário aos MFEs via props.
 *  - Carregar os remotes com resiliência (loading, erro, retry).
 * Regra: o shell NÃO tem regra de negócio de nenhum domínio.
 */
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      ...federationDefaults,
      name: 'shell',
      remotes: {
        catalog: remoteManifest('catalog'),
        cart: remoteManifest('cart'),
      },
      shared: createShared(pkg.dependencies),
      // Plugins de runtime rodam no browser e interceptam o ciclo de vida do MF.
      runtimePlugins: ['./src/mf/platform-runtime-plugin.ts'],
    }),
  ],
  server: {
    port: ports.shell,
    // SPA: qualquer rota desconhecida devolve o index.html (deep links).
    historyApiFallback: true,
  },
  source: {
    // Origens dos remotes disponíveis no código do shell (usadas nas etiquetas
    // do modo "Show boundaries"). Substituído em build time.
    define: {
      __MFE_ORIGINS__: JSON.stringify({
        catalog: remoteOrigin('catalog'),
        cart: remoteOrigin('cart'),
      }),
    },
  },
  html: { title: 'Archipelago — micro frontends, composed at runtime', tags: fontTags },
});
