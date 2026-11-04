import { readFileSync } from 'node:fs';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { allowedOrigins, createShared, ports, federationDefaults, fontTags } from '@mfe/mf-config';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/**
 * CART — mostra os DOIS tipos de exposição:
 *  - './App'       → app-level (página /cart/*, raiz React própria via bridge)
 *  - './CartBadge' → component-level (um componente que o shell renderiza
 *                    DENTRO da árvore React dele, no header)
 */
export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      ...federationDefaults,
      name: 'cart',
      exposes: {
        './App': './src/export-app.tsx',
        './CartBadge': './src/components/CartBadge.tsx',
      },
      shared: createShared(pkg.dependencies),
    }),
  ],
  server: { port: ports.cart, cors: { origin: allowedOrigins } },
  dev: { assetPrefix: 'auto' },
  output: {
    assetPrefix: 'auto',
  },
  html: { title: 'cart · standalone', tags: fontTags },
});
