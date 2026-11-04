import { defineConfig, devices } from '@playwright/test';

/**
 * E2E da PLATAFORMA (composição real dos 3 MFEs).
 *
 * Roda contra os builds de PRODUÇÃO (`pnpm preview`), não contra o dev server:
 * queremos testar exatamente os artefatos que vão para o CDN (manifests,
 * chunks, publicPath 'auto', CORS).
 *
 * Testes unitários vivem em cada MFE (vitest). Aqui ficam só fluxos que
 * atravessam fronteiras: eventos entre MFEs, roteamento, resiliência.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /screenshots.spec.ts/,
    },
    {
      // `pnpm screenshots` — regenera as imagens do README em docs/assets.
      name: 'screenshots',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      },
      testMatch: /screenshots.spec.ts/,
    },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
