/**
 * Standalone: http://localhost:4002. Inclui um botão "fake catálogo" para
 * simular o evento que o MFE de catálogo publicaria — assim o time do carrinho
 * testa a integração sem depender do outro time.
 */
import './standalone.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@mfe/ui';
import { publish } from '@mfe/contracts';
import { App } from './App';
import { CartBadge } from './components/CartBadge';

function StandaloneHarness() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center gap-3 rounded-island border border-dashed border-ochre p-4">
        <span className="font-mono text-xs text-ink-soft">standalone harness</span>
        <CartBadge />
        <Button
          variant="ghost"
          onClick={() =>
            publish('cart:add-requested', {
              product: {
                id: 'fake-1',
                name: 'Test product',
                description: '',
                priceInCents: 1990,
                imageEmoji: '🧪',
                category: 'Test',
              },
              quantity: 1,
            })
          }
        >
          Simulate catalog event
        </Button>
      </div>
      <App basename="/" user={null} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StandaloneHarness />
  </StrictMode>,
);
