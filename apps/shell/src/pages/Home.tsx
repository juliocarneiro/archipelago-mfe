import { Link } from 'react-router';
import { Button, Eyebrow, cx } from '@mfe/ui';
import { useBoundaries } from '../islands/boundaries';

/**
 * A home é do shell. O "mapa" abaixo descreve fatos reais desta página:
 * quem é dono de cada pedaço, o que cada remote expõe e onde ele roda.
 */
const islands = [
  {
    name: 'shell',
    port: 4000,
    color: 'border-team-shell text-team-shell',
    owns: 'Layout, top-level routes, session',
    exposes: 'nothing — it consumes',
  },
  {
    name: 'catalog',
    port: 4001,
    color: 'border-team-catalog text-team-catalog',
    owns: 'Product list and detail, /catalog/*',
    exposes: './App',
  },
  {
    name: 'cart',
    port: 4002,
    color: 'border-team-cart text-team-cart',
    owns: 'Cart state, /cart/*, header badge',
    exposes: './App · ./CartBadge',
  },
] as const;

export function Home() {
  const { visible, toggle } = useBoundaries();

  return (
    <div className="grid gap-16">
      <section className="grid gap-6">
        <Eyebrow>Micro frontend boilerplate</Eyebrow>
        <h1 className="max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.035em] text-balance">
          Three apps. Three deploys. <span className="text-sea">One page.</span>
        </h1>
        <p className="max-w-2xl text-lg text-pretty text-ink-soft">
          Archipelago composes independently built and deployed React apps at runtime with Module
          Federation 2.0. Each team owns its island: code, routes, state and release schedule.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/catalog"
            className="inline-flex h-11 items-center rounded-full bg-sea px-6 font-semibold text-white transition-colors hover:bg-sea-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
          >
            Browse the catalog
          </Link>
          <Button
            variant="ghost"
            className="h-11 font-mono text-sm"
            onClick={toggle}
            aria-pressed={visible}
          >
            {visible ? 'Hide boundaries' : 'Show boundaries'}
          </Button>
        </div>
      </section>

      <section aria-labelledby="map-title" className="grid gap-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="map-title" className="font-display text-2xl font-bold tracking-tight">
            How this page is assembled
          </h2>
          <p className="font-mono text-xs text-ink-soft">
            Toggle boundaries, then open the catalog to see each island outlined.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {islands.map((island) => (
            <li
              key={island.name}
              className={cx(
                'grid gap-4 rounded-island border-2 border-dashed bg-surface p-6',
                island.color,
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl font-bold">{island.name}</span>
                <span className="font-mono text-xs">:{island.port}</span>
              </div>
              <dl className="grid gap-3 text-sm text-ink">
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-wider text-ink-soft uppercase">
                    Owns
                  </dt>
                  <dd>{island.owns}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-wider text-ink-soft uppercase">
                    Exposes
                  </dt>
                  <dd className="font-mono text-[0.8rem]">{island.exposes}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
