import { useState } from 'react';
import { Button, Eyebrow } from '@mfe/ui';
import { formatPrice, publish, type User } from '@mfe/contracts';
import { useCart } from '../store/useCart';

export function CartPage({ user }: { user: User | null }) {
  const { lines, totalItems, totalInCents, setQuantity, clear } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  function placeOrder() {
    clear();
    setOrderPlaced(true);
  }

  // Navegação para FORA do nosso domínio: pedimos ao shell via evento.
  const goToCatalog = () => publish('shell:navigate', { to: '/catalog' });

  if (lines.length === 0) {
    return (
      <section className="grid max-w-xl gap-4">
        <Eyebrow>Cart</Eyebrow>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          {orderPlaced ? 'Order placed.' : 'Your cart is empty.'}
        </h1>
        <p className="text-ink-soft">
          {orderPlaced
            ? 'This is a demo, so nothing ships — but the cart island cleared its own state and told the rest of the page.'
            : 'Add something from the catalog and it shows up here, even though the two are separate apps.'}
        </p>
        <Button variant="ghost" className="w-fit" onClick={goToCatalog}>
          Browse the catalog
        </Button>
      </section>
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Eyebrow>Cart</Eyebrow>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Review your order</h1>
        </div>

        <ul className="divide-y divide-line rounded-island border border-line bg-surface">
          {lines.map((line) => (
            <li key={line.productId} className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
              <div className="min-w-40 flex-1">
                <p className="font-display text-lg font-bold">{line.name}</p>
                <p className="font-mono text-xs text-ink-soft">
                  {formatPrice(line.priceInCents)} each
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-line p-1">
                <Button
                  variant="quiet"
                  size="sm"
                  className="w-8 px-0"
                  aria-label={`Remove one ${line.name}`}
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                >
                  −
                </Button>
                <span
                  className="w-6 text-center font-mono text-sm tabular-nums"
                  aria-label={`${line.name} quantity`}
                >
                  {line.quantity}
                </span>
                <Button
                  variant="quiet"
                  size="sm"
                  className="w-8 px-0"
                  aria-label={`Add one ${line.name}`}
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <span className="w-24 text-right font-mono font-medium tabular-nums">
                {formatPrice(line.priceInCents * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <aside className="grid gap-5 rounded-island border border-line bg-ochre-wash p-6 lg:sticky lg:top-24">
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Items</dt>
            <dd className="font-mono tabular-nums">{totalItems}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Shipping</dt>
            <dd className="font-mono">Free</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-ochre/30 pt-3">
            <dt className="font-semibold">Total</dt>
            <dd className="font-mono text-2xl font-medium tabular-nums">
              {formatPrice(totalInCents)}
            </dd>
          </div>
        </dl>
        <Button onClick={placeOrder} disabled={!user}>
          Place order
        </Button>
        {!user && (
          <p className="text-center text-xs text-ink-soft">
            Sign in from the header to place the order.
          </p>
        )}
      </aside>
    </section>
  );
}
