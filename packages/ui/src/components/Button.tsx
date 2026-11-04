import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../cx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'quiet';
  size?: 'sm' | 'md';
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,transform] duration-150 select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ' +
  'active:enabled:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none';

const variants = {
  primary: 'bg-sea text-white hover:enabled:bg-sea-deep',
  ghost: 'border border-line bg-surface text-ink hover:enabled:border-ink-soft',
  quiet: 'text-ink-soft hover:enabled:text-ink hover:enabled:bg-sea-wash',
} as const;

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-5 text-[0.95rem]',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={cx(base, variants[variant], sizes[size], className)} {...rest} />
  );
}
