/**
 * Declaração dos módulos remotos para o TypeScript.
 *
 * `import('catalog/App')` não existe no disco — é resolvido em RUNTIME pelo
 * Module Federation. Aqui dizemos ao TS qual é o formato, usando os contratos
 * de @mfe/contracts (contract-first). Se o contrato mudar de forma
 * incompatível, o typecheck do shell quebra no CI. É isso que queremos.
 */

declare module 'catalog/App' {
  import type { CatalogAppProps } from '@mfe/contracts';
  import type { BridgeProvider } from './bridge-types';
  const provider: BridgeProvider<CatalogAppProps>;
  export default provider;
}

declare module 'cart/App' {
  import type { CartAppProps } from '@mfe/contracts';
  import type { BridgeProvider } from './bridge-types';
  const provider: BridgeProvider<CartAppProps>;
  export default provider;
}

declare module 'cart/CartBadge' {
  import type { ComponentType } from 'react';
  import type { CartBadgeProps } from '@mfe/contracts';
  const CartBadge: ComponentType<CartBadgeProps>;
  export default CartBadge;
}
