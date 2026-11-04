import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * Estado do modo "Show boundaries" (a assinatura visual da plataforma).
 * Liga/desliga `data-boundaries` no <html>; o CSS em styles.css faz o resto.
 * Persistido para sobreviver a reloads durante uma demo.
 */
interface BoundariesValue {
  visible: boolean;
  toggle: () => void;
}

const BoundariesContext = createContext<BoundariesValue | null>(null);
const STORAGE_KEY = 'mfe:shell:boundaries';

export function BoundariesProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(() => localStorage.getItem(STORAGE_KEY) === 'on');

  useEffect(() => {
    document.documentElement.dataset.boundaries = visible ? 'on' : 'off';
    localStorage.setItem(STORAGE_KEY, visible ? 'on' : 'off');
  }, [visible]);

  const toggle = useCallback(() => setVisible((v) => !v), []);
  const value = useMemo(() => ({ visible, toggle }), [visible, toggle]);
  return <BoundariesContext value={value}>{children}</BoundariesContext>;
}

export function useBoundaries(): BoundariesValue {
  const ctx = use(BoundariesContext);
  if (!ctx) throw new Error('useBoundaries precisa estar dentro de <BoundariesProvider>');
  return ctx;
}
