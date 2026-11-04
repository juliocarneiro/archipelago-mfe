import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@mfe/ui';

export type IslandName = 'shell' | 'catalog' | 'cart';

const origins: Record<IslandName, string> = {
  shell: 'host',
  catalog: __MFE_ORIGINS__.catalog.replace(/^https?:\/\//, ''),
  cart: __MFE_ORIGINS__.cart.replace(/^https?:\/\//, ''),
};

interface IslandProps {
  /** Qual MFE (time) é dono deste pedaço da tela. */
  name: IslandName;
  /** Rótulo extra, ex.: o módulo exposto (`./CartBadge`). */
  module?: string;
  /** Distância do contorno até o conteúdo (px). */
  offset?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Marca uma região da página como pertencente a um MFE.
 * Quem coloca a marca é o SHELL — os remotes não sabem que estão sendo
 * "desenhados". Zero acoplamento extra.
 */
export function Island({ name, module, offset = 8, className, children }: IslandProps) {
  const style = {
    '--island-color': `var(--color-team-${name})`,
    '--island-offset': `${offset}px`,
  } as CSSProperties;

  return (
    <div
      data-mfe={name}
      data-mfe-origin={module ? `${module} · ${origins[name]}` : origins[name]}
      className={cx(className)}
      style={style}
    >
      {children}
    </div>
  );
}
