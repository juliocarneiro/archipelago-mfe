import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { publish, type User } from '@mfe/contracts';

/**
 * SESSÃO — responsabilidade do shell.
 *
 * Fluxo: o shell autentica (aqui é um login fake) e passa `user` como PROP para
 * cada MFE (props down). Também publica `auth:changed` para widgets que não
 * recebem props diretamente.
 *
 * Em produção: tokens em cookie httpOnly (o JS nem vê o token) e cada MFE chama
 * a API com `credentials: 'include'`. NUNCA coloque token no window ou no
 * localStorage para "compartilhar" com MFEs.
 */
interface SessionValue {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);
const STORAGE_KEY = 'mfe:shell:session';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  useEffect(() => {
    if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(STORAGE_KEY);
    publish('auth:changed', { userId: user?.id ?? null });
  }, [user]);

  const signIn = useCallback(() => setUser({ id: 'u-42', name: 'Ada' }), []);
  const signOut = useCallback(() => setUser(null), []);
  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionValue {
  const ctx = use(SessionContext);
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return ctx;
}
