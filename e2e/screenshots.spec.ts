import { expect, test } from '@playwright/test';

/**
 * Gera as imagens do README (docs/assets). Rode com `pnpm screenshots`.
 * Não faz parte da suíte de E2E (projeto "screenshots" no playwright.config.ts).
 */
const out = (name: string) => `docs/assets/${name}.png`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem(
      'mfe:cart:v1',
      JSON.stringify([
        { productId: 'kb-01', name: 'Low-profile keyboard', priceInCents: 14900, quantity: 1 },
        { productId: 'ms-02', name: 'Wireless mouse', priceInCents: 7900, quantity: 2 },
      ]),
    );
  });
});

test('home', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('cart-count')).toHaveText('3');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out('home') });
});

test('catalog with boundaries', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mfe:shell:boundaries', 'on'));
  await page.goto('/catalog');
  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
  await expect(page.getByTestId('cart-count')).toHaveText('3');
  await expect(page.getByText('Low-profile keyboard')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out('catalog-boundaries') });
});

test('cart', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Review your order' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out('cart') });
});

test('resilience', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mfe:shell:boundaries', 'on'));
  await page.route('http://localhost:4001/**', (route) => route.abort());
  await page.goto('/catalog');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByTestId('cart-count')).toHaveText('3');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out('resilience') });
});
