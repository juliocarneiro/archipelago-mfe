import type { CartBadgeProps } from '@mfe/contracts';
import { useCart } from '../store/useCart';
import '../styles.css';

/**
 * COMPONENT-LEVEL REMOTE.
 * Renderizado DENTRO da árvore React do shell (não usa bridge). Por isso
 * depende de React ser `singleton` no `shared` — senão seriam dois Reacts e
 * os hooks quebrariam.
 *
 * Use component-level para widgets pequenos; app-level (bridge) para páginas.
 */
export function CartBadge({ onClick }: CartBadgeProps) {
  const { totalItems } = useCart();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
      className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface pr-1 pl-3 text-sm font-semibold text-ink transition-colors hover:border-ochre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
    >
      Cart
      <span
        data-testid="cart-count"
        className="grid h-6 min-w-6 place-items-center rounded-full bg-ochre px-1.5 font-mono text-xs text-white tabular-nums"
      >
        {totalItems}
      </span>
    </button>
  );
}

// `export default` é o que `React.lazy(() => import('cart/CartBadge'))` espera.
export default CartBadge;
