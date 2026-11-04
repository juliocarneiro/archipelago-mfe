import { useSyncExternalStore } from 'react';
import { cartStore, connectCartStore } from './cart-store';

connectCartStore();

export function useCart() {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalInCents = lines.reduce((sum, l) => sum + l.quantity * l.priceInCents, 0);
  return { lines, totalItems, totalInCents, ...cartStore };
}
