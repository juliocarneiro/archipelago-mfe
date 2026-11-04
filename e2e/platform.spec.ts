import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Cada teste começa com storage limpo (carrinho, sessão, overrides).
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__e2e_init__')) {
      localStorage.clear();
      sessionStorage.clear();
      sessionStorage.setItem('__e2e_init__', '1');
    }
  });
});

test('o shell compõe os remotes na mesma página', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Cart, 0 items$/ })).toBeVisible();
});

test('catalog → cart: evento atravessa a fronteira entre MFEs', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Add Wireless mouse to cart' }).click();
  await page.getByRole('button', { name: 'Add Wireless mouse to cart' }).click();

  // O badge é renderizado pelo remote "cart", que nunca foi importado pelo catalog.
  await expect(page.getByTestId('cart-count')).toHaveText('2');

  await page.getByRole('button', { name: /^Cart, 2 items$/ }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByText('Wireless mouse', { exact: true })).toBeVisible();
});

test('routers do shell e do remote ficam sincronizados', async ({ page }) => {
  await page.goto('/catalog');
  // Navegação INTERNA do remote (router do catalog)...
  await page.getByRole('link', { name: '27" 4K monitor' }).click();
  await expect(page).toHaveURL(/\/catalog\/p\/mn-03$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('27" 4K monitor');

  // ...e depois navegação do SHELL para uma rota do mesmo remote.
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Catalog' })
    .click();
  await expect(page.getByRole('heading', { name: 'Catalog' })).toBeVisible();

  // Botão voltar do browser.
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('27" 4K monitor');
});

test('resiliência: com o catalog fora do ar, o resto da página funciona', async ({ page }) => {
  await page.route('http://localhost:4001/**', (route) => route.abort());

  await page.goto('/catalog');
  await expect(page.getByRole('alert')).toContainText('catalog is unavailable');

  // Header (shell) e badge (cart) continuam vivos.
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Cart, 0 items$/ })).toBeVisible();

  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByRole('heading', { name: 'Your cart is empty.' })).toBeVisible();
});

test('arquitetura: React e libs internas existem UMA vez na página', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Your cart is empty.' })).toBeVisible();

  const providers = await page.evaluate(() => {
    type Share = Record<
      string,
      Record<string, Record<string, Record<string, { from: string; loaded?: boolean }>>>
    >;
    const share = (globalThis as unknown as { __FEDERATION__: { __SHARE__: Share } }).__FEDERATION__
      .__SHARE__;
    const result: Record<string, string[]> = {};
    for (const scopes of Object.values(share)) {
      for (const pkgs of Object.values(scopes)) {
        for (const name of ['react', 'react-dom', '@mfe/ui', '@mfe/contracts']) {
          for (const [version, info] of Object.entries(pkgs[name] ?? {})) {
            if (info.loaded) (result[name] ??= []).push(`${version}@${info.from}`);
          }
        }
      }
    }
    return Object.fromEntries(Object.entries(result).map(([k, v]) => [k, [...new Set(v)]]));
  });

  for (const name of ['react', 'react-dom', '@mfe/ui', '@mfe/contracts']) {
    expect(providers[name], `${name} deveria ter um único provider`).toHaveLength(1);
  }
});
