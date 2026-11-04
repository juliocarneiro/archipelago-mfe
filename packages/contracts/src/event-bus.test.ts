import { afterEach, describe, expect, it, vi } from 'vitest';
import { __resetEventBus, getLast, publish, subscribe } from './event-bus';

const payload = { lines: [], totalItems: 3, totalInCents: 1000 };

describe('event bus', () => {
  afterEach(() => __resetEventBus());

  it('entrega eventos para quem assinou', () => {
    const handler = vi.fn();
    const off = subscribe('cart:updated', handler);
    publish('cart:updated', payload);
    expect(handler).toHaveBeenCalledWith(payload);
    off();
  });

  it('para de entregar depois do unsubscribe', () => {
    const handler = vi.fn();
    const off = subscribe('cart:updated', handler);
    off();
    publish('cart:updated', payload);
    expect(handler).not.toHaveBeenCalled();
  });

  it('faz replay do último valor para quem assina tarde', () => {
    publish('cart:updated', payload);
    const handler = vi.fn();
    subscribe('cart:updated', handler, { replay: true });
    expect(handler).toHaveBeenCalledWith(payload);
    expect(getLast('cart:updated')).toEqual(payload);
  });
});
