import { useState } from 'react';
import { createRemoteAppComponent } from '@module-federation/bridge-react/base';
import { ErrorState, Spinner } from '@mfe/ui';
import { useSession } from '../auth/session';
import { Island } from '../islands/Island';
import { RemoteBoundary } from './RemoteBoundary';

/**
 * APP-LEVEL REMOTES (via bridge).
 *
 * `createRemoteAppComponent` cuida do ciclo de vida: baixa o remote, chama
 * `render()` num <div> quando monta e `destroy()` quando desmonta (ex.: ao
 * navegar de /catalog para /cart). O remote ganha uma raiz React própria.
 */
function bridgeFallback(name: string) {
  return function BridgeFallback({ error }: { error: Error }) {
    console.error(`[mfe:${name}]`, error);
    return (
      <ErrorState
        title={`${name} is unavailable right now`}
        description="The rest of the page keeps working. This island failed to load or crashed while rendering."
        onRetry={() => window.location.reload()}
      />
    );
  };
}

const CatalogRemote = createRemoteAppComponent({
  loader: () => import('catalog/App'),
  loading: <Spinner label="Loading catalog…" />,
  fallback: bridgeFallback('catalog'),
});

const CartRemote = createRemoteAppComponent({
  loader: () => import('cart/App'),
  loading: <Spinner label="Loading cart…" />,
  fallback: bridgeFallback('cart'),
});

/** Monta um app remoto passando o contrato `MfeAppProps` (basename + user). */
function useRemoteProps(basename: string) {
  const { user } = useSession();
  const [attempt, setAttempt] = useState(0);
  return { props: { basename, user }, attempt, retry: () => setAttempt((n) => n + 1) };
}

export function CatalogApp() {
  const { props, attempt, retry } = useRemoteProps('/catalog');
  return (
    <Island name="catalog" module="./App">
      <RemoteBoundary key={attempt} name="catalog" onRetry={retry}>
        <CatalogRemote {...props} />
      </RemoteBoundary>
    </Island>
  );
}

export function CartApp() {
  const { props, attempt, retry } = useRemoteProps('/cart');
  return (
    <Island name="cart" module="./App">
      <RemoteBoundary key={attempt} name="cart" onRetry={retry}>
        <CartRemote {...props} />
      </RemoteBoundary>
    </Island>
  );
}
