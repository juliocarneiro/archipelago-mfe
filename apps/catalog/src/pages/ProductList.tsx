import { Link } from 'react-router';
import { ErrorState, Eyebrow, Spinner } from '@mfe/ui';
import { formatPrice, type User } from '@mfe/contracts';
import { fetchProducts } from '../data/products';
import { useAsync } from '../hooks/useAsync';
import { AddToCartButton } from '../components/AddToCartButton';
import { ProductArt } from '../components/ProductArt';

export function ProductList({ user }: { user: User | null }) {
  const state = useAsync(fetchProducts, 'all');

  return (
    <section aria-labelledby="catalog-title" className="grid gap-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Eyebrow>Desk setup</Eyebrow>
          <h1 id="catalog-title" className="font-display text-4xl font-extrabold tracking-tight">
            Catalog
          </h1>
        </div>
        <p className="text-sm text-ink-soft">
          {user ? `Signed in as ${user.name}.` : 'Browsing as a guest.'}
        </p>
      </header>

      {state.status === 'loading' && <Spinner label="Loading products…" />}
      {state.status === 'error' && <ErrorState title="Products could not be loaded" />}
      {state.status === 'success' && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {state.data.map((product) => (
            <li
              key={product.id}
              className="group flex flex-col gap-4 rounded-island border border-line bg-surface p-4 transition-shadow hover:shadow-[0_10px_30px_-12px_rgb(20_35_43/0.25)]"
            >
              <Link to={`p/${product.id}`} tabIndex={-1} aria-hidden="true">
                <ProductArt emoji={product.imageEmoji} />
              </Link>
              <div className="grid gap-1 px-1">
                <Eyebrow>{product.category}</Eyebrow>
                <h2 className="font-display text-lg leading-tight font-bold">
                  <Link to={`p/${product.id}`} className="underline-offset-4 hover:underline">
                    {product.name}
                  </Link>
                </h2>
              </div>
              <div className="mt-auto flex items-center justify-between px-1">
                <span className="font-mono text-base font-medium tabular-nums">
                  {formatPrice(product.priceInCents)}
                </span>
                <AddToCartButton product={product} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
