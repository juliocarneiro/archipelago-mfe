import { lazy } from 'react';
import type { CartBadgeProps } from '@mfe/contracts';
import { RemoteBoundary } from './RemoteBoundary';

/**
 * COMPONENT-LEVEL REMOTE: React.lazy + import dinâmico do módulo federado.
 * Roda dentro da árvore React do shell (mesmo React, graças ao singleton).
 */
const RemoteCartBadge = lazy(() => import('cart/CartBadge'));

/** Fallback discreto: no header, um erro grande quebraria o layout. */
const placeholder = (
  <span
    className="inline-flex h-8 w-14 items-center justify-center rounded-full border border-line font-mono text-xs text-ink-soft"
    aria-hidden="true"
  >
    cart
  </span>
);

export function CartBadge(props: CartBadgeProps) {
  return (
    <RemoteBoundary name="cart-badge" compactFallback={placeholder}>
      <RemoteCartBadge {...props} />
    </RemoteBoundary>
  );
}
