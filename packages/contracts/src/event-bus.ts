import type { MfeEventMap, MfeEventName } from './events';

/**
 * Event bus tipado baseado em CustomEvent do DOM.
 *
 * Por que CustomEvent no `window` e não uma lib de estado global?
 *  - É nativo do browser: funciona entre MFEs em React, Vue, Angular, vanilla...
 *  - Não exige que todos os MFEs compartilhem a MESMA instância de uma lib
 *    (mesmo que o MF falhe em compartilhar o pacote, o `window` é um só).
 *  - Fácil de inspecionar/depurar (é só escutar no console).
 *
 * Extra: guardamos o último payload de cada evento ("replay"), para que um MFE
 * que montou DEPOIS do evento ser emitido consiga ler o estado atual.
 * Ex.: o badge do carrinho carrega depois do carrinho ter publicado `cart:updated`.
 */

const PREFIX = 'mfe:';
const LAST_KEY = '__MFE_LAST_EVENTS__';

type LastEvents = Partial<{ [K in MfeEventName]: MfeEventMap[K] }>;

function lastEvents(): LastEvents {
  const w = globalThis as unknown as Record<string, LastEvents | undefined>;
  return (w[LAST_KEY] ??= {});
}

export function publish<K extends MfeEventName>(name: K, detail: MfeEventMap[K]): void {
  lastEvents()[name] = detail;
  globalThis.dispatchEvent(new CustomEvent(PREFIX + name, { detail }));
}

/**
 * Assina um evento. Retorna a função de cancelamento (use no cleanup do useEffect).
 * @param options.replay se true, o handler é chamado imediatamente com o último valor publicado.
 */
export function subscribe<K extends MfeEventName>(
  name: K,
  handler: (detail: MfeEventMap[K]) => void,
  options: { replay?: boolean } = {},
): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<MfeEventMap[K]>).detail);
  globalThis.addEventListener(PREFIX + name, listener);

  if (options.replay) {
    const last = lastEvents()[name];
    if (last !== undefined) handler(last as MfeEventMap[K]);
  }

  return () => globalThis.removeEventListener(PREFIX + name, listener);
}

/** Lê o último payload publicado (sem assinar). */
export function getLast<K extends MfeEventName>(name: K): MfeEventMap[K] | undefined {
  return lastEvents()[name] as MfeEventMap[K] | undefined;
}

/** Só para testes. */
export function __resetEventBus(): void {
  const w = globalThis as unknown as Record<string, unknown>;
  delete w[LAST_KEY];
}
