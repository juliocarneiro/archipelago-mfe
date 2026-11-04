import { useEffect, useState } from 'react';

type Settled<T> = { status: 'success'; data: T } | { status: 'error'; error: Error };
type State<T> = { status: 'loading' } | Settled<T>;

/**
 * Hook mínimo de data fetching. Em produção use TanStack Query — e note que,
 * se vários MFEs usarem TanStack Query, cada um deve ter seu PRÓPRIO QueryClient
 * (cache isolado = MFE isolado). Compartilhar cache entre MFEs cria acoplamento.
 *
 * O resultado é "carimbado" com a `key` que o gerou: quando a key muda, o
 * estado de loading é DERIVADO no render (sem setState síncrono no effect).
 */
export function useAsync<T>(fn: () => Promise<T>, key: string): State<T> {
  const [result, setResult] = useState<{ key: string; state: Settled<T> } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fn().then(
      (data) => !cancelled && setResult({ key, state: { status: 'success', data } }),
      (error: Error) => !cancelled && setResult({ key, state: { status: 'error', error } }),
    );
    return () => {
      cancelled = true;
    };
    // `fn` costuma ser uma closure nova a cada render; a `key` é quem manda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!result || result.key !== key) return { status: 'loading' };
  return result.state;
}
