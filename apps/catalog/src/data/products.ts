import type { Product } from '@mfe/contracts';

/**
 * "API" do catálogo. Num projeto real, cada MFE chama o SEU backend (ou BFF).
 * Esse é o ponto de "times verticais": o time de catálogo é dono da tela E dos
 * dados de catálogo. O shell não busca produtos para ninguém.
 */
const PRODUCTS: Product[] = [
  {
    id: 'kb-01',
    name: 'Low-profile keyboard',
    description: 'Tactile switches, aluminium case, hot-swappable. Quiet enough for open offices.',
    priceInCents: 14900,
    imageEmoji: '⌨️',
    category: 'Input',
  },
  {
    id: 'ms-02',
    name: 'Wireless mouse',
    description: '58 g shell, 90-hour battery, USB-C charging while you work.',
    priceInCents: 7900,
    imageEmoji: '🖱️',
    category: 'Input',
  },
  {
    id: 'mn-03',
    name: '27" 4K monitor',
    description: 'IPS panel, 144 Hz, single-cable USB-C with 90 W power delivery.',
    priceInCents: 54900,
    imageEmoji: '🖥️',
    category: 'Displays',
  },
  {
    id: 'hp-04',
    name: 'Noise-cancelling headset',
    description: 'Active noise cancelling with a boom mic for long calls.',
    priceInCents: 19900,
    imageEmoji: '🎧',
    category: 'Audio',
  },
  {
    id: 'cm-05',
    name: '1080p webcam',
    description: 'Autofocus, low-light correction and a physical privacy shutter.',
    priceInCents: 8900,
    imageEmoji: '📷',
    category: 'Video',
  },
  {
    id: 'dk-06',
    name: 'USB-C dock',
    description: 'Two HDMI outputs, gigabit Ethernet, four USB ports and an SD reader.',
    priceInCents: 12900,
    imageEmoji: '🔌',
    category: 'Accessories',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProducts(): Promise<Product[]> {
  await delay(250);
  return PRODUCTS;
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  await delay(150);
  return PRODUCTS.find((p) => p.id === id);
}
