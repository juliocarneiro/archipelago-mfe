import type { HTMLAttributes } from 'react';
import { cx } from '../cx';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        'rounded-island border border-line bg-surface p-6 shadow-[0_1px_0_rgb(20_35_43/0.04)]',
        className,
      )}
      {...rest}
    />
  );
}

/** Rótulo pequeno em mono, acima de títulos. */
export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx(
        'font-mono text-[0.7rem] font-medium tracking-[0.08em] text-ink-soft uppercase',
        className,
      )}
      {...rest}
    />
  );
}
