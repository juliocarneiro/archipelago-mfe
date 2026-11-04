import { Link, useParams } from 'react-router';
import { ErrorState, Eyebrow, Spinner } from '@mfe/ui';
import { formatPrice } from '@mfe/contracts';
import { fetchProduct } from '../data/products';
import { useAsync } from '../hooks/useAsync';
import { AddToCartButton } from '../components/AddToCartButton';
import { ProductArt } from '../components/ProductArt';

export function ProductDetail() {
  const { productId = '' } = useParams();
  const state = useAsync(() => fetchProduct(productId), productId);

  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'error' || !state.data) {
    return <ErrorState title="This product does not exist" />;
  }

  const product = state.data;
  return (
    <article className="grid gap-8">
      {/* Link relativo ao basename: "/" aqui é "/catalog" quando montado no shell. */}
      <Link to="/" className="w-fit font-mono text-xs text-ink-soft hover:text-ink">
        ← All products
      </Link>
      <div className="grid items-start gap-8 rounded-island border border-line bg-surface p-5 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:p-8">
        <ProductArt emoji={product.imageEmoji} large />
        <div className="grid gap-5 md:py-4">
          <Eyebrow>{product.category}</Eyebrow>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none font-extrabold tracking-tight">
            {product.name}
          </h1>
          <p className="max-w-prose text-lg text-ink-soft">{product.description}</p>
          <div className="flex flex-wrap items-center gap-5 border-t border-line pt-5">
            <span className="font-mono text-2xl font-medium tabular-nums">
              {formatPrice(product.priceInCents)}
            </span>
            <AddToCartButton product={product} size="md" />
          </div>
        </div>
      </div>
    </article>
  );
}
