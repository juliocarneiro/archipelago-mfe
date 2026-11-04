import { afterEach, describe, expect, it, vi } from 'vitest';
import { __resetEventBus, publish, subscribe, type Product } from '@mfe/contracts';
import { __resetCartStore, cartStore, connectCartStore } from './cart-store';

const product: Product = {
  id: 'p1',
  name: 'Mouse',
  description: '',
  priceInCents: 1000,
  imageEmoji: '🖱️',
  category: 'x',
};

describe('cart store', () => {
  afterEach(() => {
    __resetCartStore();
    __resetEventBus();
    localStorage.clear();
  });

  it('reage ao evento cart:add-requested e publica cart:updated', () => {
    connectCartStore();
    const onUpdated = vi.fn();
    const off = subscribe('cart:updated', onUpdated);

    publish('cart:add-requested', { product, quantity: 2 });
    publish('cart:add-requested', { product, quantity: 1 });

    expect(cartStore.getSnapshot()).toEqual([
      { productId: 'p1', name: 'Mouse', priceInCents: 1000, quantity: 3 },
    ]);
    expect(onUpdated).toHaveBeenLastCalledWith(
      expect.objectContaining({ totalItems: 3, totalInCents: 3000 }),
    );
    off();
  });

  it('remove a linha quando a quantidade chega a zero', () => {
    cartStore.add(product, 1);
    cartStore.setQuantity('p1', 0);
    expect(cartStore.getSnapshot()).toEqual([]);
  });

  it('persiste no localStorage com chave namespaced', () => {
    cartStore.add(product, 1);
    expect(localStorage.getItem('mfe:cart:v1')).toContain('"productId":"p1"');
  });
});
