import { useState } from 'react';
import { Button } from '@mfe/ui';
import { publish, type Product } from '@mfe/contracts';

/**
 * Note: o catálogo NÃO importa nada do carrinho. Ele publica uma INTENÇÃO
 * (`cart:add-requested`) e quem for dono do carrinho reage. Se o MFE do
 * carrinho estiver fora do ar, o catálogo continua funcionando.
 */
export function AddToCartButton({
  product,
  size = 'sm',
}: {
  product: Product;
  size?: 'sm' | 'md';
}) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    publish('cart:add-requested', { product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Button size={size} onClick={handleClick} aria-label={`Add ${product.name} to cart`}>
      <span aria-live="polite">{added ? 'Added ✓' : 'Add to cart'}</span>
    </Button>
  );
}
