import type { ReactNode } from 'react';
import { Button } from './Button';

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      className="grid place-items-center gap-3 py-16 text-ink-soft"
      role="status"
      aria-live="polite"
    >
      <div
        className="size-7 animate-spin rounded-full border-[3px] border-line border-t-sea motion-reduce:animate-[spin_3s_linear_infinite]"
        aria-hidden="true"
      />
      <span className="font-mono text-xs">{label}</span>
    </div>
  );
}

export interface ErrorStateProps {
  title: string;
  description?: ReactNode;
  onRetry?: () => void;
}

/**
 * Estado de erro padronizado. Usado pelo shell quando um remote não carrega:
 * a página continua de pé e só o "pedaço" quebrado mostra este aviso.
 */
export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      className="grid place-items-center gap-2 rounded-island border border-dashed border-coral/60 bg-coral/5 px-6 py-12 text-center"
      role="alert"
    >
      <p className="font-display text-lg font-semibold text-coral">{title}</p>
      {description ? <p className="max-w-prose text-sm text-ink-soft">{description}</p> : null}
      {onRetry ? (
        <Button variant="ghost" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
