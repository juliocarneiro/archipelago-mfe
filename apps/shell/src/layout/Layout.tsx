import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { Button, cx } from '@mfe/ui';
import { notifyLocationChange, subscribe } from '@mfe/contracts';
import { useSession } from '../auth/session';
import { useBoundaries } from '../islands/boundaries';
import { Island } from '../islands/Island';
import { CartBadge } from '../remotes/CartBadge';

/** Mantém os routers dos MFEs montados em sincronia com o router do shell. */
function useHistorySync() {
  const location = useLocation();
  useEffect(() => {
    notifyLocationChange();
  }, [location.pathname, location.search, location.hash]);
}

/** MFEs pedem navegação cross-domínio via evento; o shell executa. */
function useNavigationRequests() {
  const navigate = useNavigate();
  useEffect(() => subscribe('shell:navigate', ({ to }) => navigate(to)), [navigate]);
}

const navLink = ({ isActive }: { isActive: boolean }) =>
  cx(
    'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
    isActive ? 'bg-ink text-mist' : 'text-ink-soft hover:text-ink',
  );

export function Layout() {
  const { user, signIn, signOut } = useSession();
  const { visible, toggle } = useBoundaries();
  const navigate = useNavigate();
  useHistorySync();
  useNavigationRequests();

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <header className="sticky top-0 z-40 border-b border-line bg-mist/85 backdrop-blur-md">
        <Island name="shell" module="header" offset={-3} className="rounded-none">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
            <NavLink to="/" className="flex items-baseline gap-2" aria-label="Archipelago home">
              <span className="font-display text-xl font-extrabold tracking-tight">
                archipelago
              </span>
              <span className="hidden font-mono text-[0.65rem] text-ink-soft sm:inline">
                mfe boilerplate
              </span>
            </NavLink>

            <nav aria-label="Main" className="flex gap-1">
              <NavLink to="/catalog" className={navLink}>
                Catalog
              </NavLink>
              <NavLink to="/cart" className={navLink}>
                Cart
              </NavLink>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="quiet"
                size="sm"
                onClick={toggle}
                aria-pressed={visible}
                className="font-mono text-xs"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'size-2.5 rounded-[3px] border-[1.5px] border-dashed',
                    visible ? 'border-sea bg-sea/20' : 'border-ink-soft',
                  )}
                />
                {visible ? 'Hide boundaries' : 'Show boundaries'}
              </Button>

              <Island name="cart" module="./CartBadge" offset={4} className="rounded-full">
                <CartBadge onClick={() => navigate('/cart')} />
              </Island>

              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign out · {user.name}
                </Button>
              ) : (
                <Button size="sm" onClick={signIn}>
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </Island>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 font-mono text-xs text-ink-soft sm:px-8">
          <span>shell :4000 · catalog :4001 · cart :4002</span>
          <span>Module Federation 2.0 · Rsbuild · React 19 · Tailwind v4</span>
        </div>
      </footer>
    </div>
  );
}
