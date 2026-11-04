import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { __resetEventBus, subscribe } from '@mfe/contracts';
import { App } from './App';

describe('Catalog MFE', () => {
  afterEach(() => __resetEventBus());

  it('lista produtos e publica cart:add-requested ao clicar em Adicionar', async () => {
    const handler = vi.fn();
    const off = subscribe('cart:add-requested', handler);

    render(<App basename="/" user={{ id: '1', name: 'Ana' }} />);

    expect(await screen.findByText('Low-profile keyboard')).toBeInTheDocument();
    expect(screen.getByText(/Signed in as Ana/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add Low-profile keyboard to cart' }));

    // Teste de CONTRATO: o payload publicado precisa respeitar MfeEventMap.
    expect(handler).toHaveBeenCalledWith({
      product: expect.objectContaining({ id: 'kb-01', priceInCents: 14900 }),
      quantity: 1,
    });
    off();
  });
});
