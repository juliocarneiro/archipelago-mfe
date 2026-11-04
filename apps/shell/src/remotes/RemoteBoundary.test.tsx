import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RemoteBoundary } from './RemoteBoundary';

function Boom(): never {
  throw new Error('remote quebrou');
}

describe('RemoteBoundary', () => {
  it('isola a falha de um remote e oferece retry', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const onRetry = vi.fn();

    render(
      <div>
        <p>Header do shell</p>
        <RemoteBoundary name="catalog" onRetry={onRetry}>
          <Boom />
        </RemoteBoundary>
      </div>,
    );

    // O resto da página continua de pé...
    expect(screen.getByText('Header do shell')).toBeInTheDocument();
    // ...e só o pedaço quebrado mostra o erro.
    expect(screen.getByRole('alert')).toHaveTextContent('catalog is unavailable');

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('usa o fallback compacto quando fornecido', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <RemoteBoundary name="badge" compactFallback={<span>placeholder</span>}>
        <Boom />
      </RemoteBoundary>,
    );
    expect(screen.getByText('placeholder')).toBeInTheDocument();
  });
});
