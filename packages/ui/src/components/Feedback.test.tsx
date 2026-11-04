import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './Feedback';

describe('ErrorState', () => {
  it('mostra título e chama onRetry', () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Catalog is unavailable" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Catalog is unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
