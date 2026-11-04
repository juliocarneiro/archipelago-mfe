import { publish, subscribe, type CartLine, type Product } from '@mfe/contracts';

/**
 * STORE DO CARRINHO — o MFE do carrinho é o ÚNICO dono deste estado.
 *
 * Padrões aplicados:
 *  - Single owner: ninguém mais altera o carrinho diretamente. Outros MFEs
 *    publicam intenções (`cart:add-requested`) e nós decidimos o que fazer.
 *  - Publicamos o estado resultante (`cart:updated`) para quem quiser exibir.
 *  - Store minúscula com `useSyncExternalStore` (sem lib). Em apps maiores,
 *    Zustand é uma ótima escolha — DENTRO do MFE, nunca como estado global
 *    da plataforma.
 *  - Persistência em localStorage com chave namespaced (`mfe:cart:`), para
 *    não colidir com chaves de outros MFEs na mesma origem.
 *
 * Módulo ES = singleton por container: CartBadge (header do shell) e App
 * (página /cart) leem a MESMA instância, porque vêm do mesmo remote.
 */

const STORAGE_KEY = 'mfe:cart:v1';

type Listener = () => void;

function load(): CartLine[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

let lines: CartLine[] = load();
const listeners = new Set<Listener>();

function commit(next: CartLine[]) {
  lines = next;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage cheio ou bloqueado: seguimos só em memória */
  }
  listeners.forEach((l) => l());
  broadcast();
}

function broadcast() {
  publish('cart:updated', {
    lines,
    totalItems: lines.reduce((sum, l) => sum + l.quantity, 0),
    totalInCents: lines.reduce((sum, l) => sum + l.quantity * l.priceInCents, 0),
  });
}

export const cartStore = {
  getSnapshot: () => lines,
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  add(product: Product, quantity = 1) {
    const existing = lines.find((l) => l.productId === product.id);
    commit(
      existing
        ? lines.map((l) =>
            l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l,
          )
        : [
            ...lines,
            {
              productId: product.id,
              name: product.name,
              priceInCents: product.priceInCents,
              quantity,
            },
          ],
    );
  },
  setQuantity(productId: string, quantity: number) {
    commit(
      quantity <= 0
        ? lines.filter((l) => l.productId !== productId)
        : lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
    );
  },
  clear() {
    commit([]);
  },
};

/**
 * Liga a store ao event bus. Idempotente (StrictMode/HMR podem chamar 2x).
 * É chamado quando qualquer módulo exposto do carrinho é carregado.
 */
let connected = false;
export function connectCartStore() {
  if (connected) return;
  connected = true;
  subscribe('cart:add-requested', ({ product, quantity }) => cartStore.add(product, quantity));
  broadcast(); // estado inicial (vindo do localStorage) para quem já está ouvindo
}

/** Só para testes. */
export function __resetCartStore() {
  lines = [];
  listeners.clear();
}
