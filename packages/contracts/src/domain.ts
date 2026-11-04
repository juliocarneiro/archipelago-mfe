/**
 * Tipos de domínio compartilhados. Mantenha este arquivo PEQUENO:
 * só entra aqui o que realmente cruza a fronteira entre MFEs.
 * Tipos internos de um MFE ficam dentro do próprio MFE.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  /** Preço em centavos — nunca use float para dinheiro. */
  priceInCents: number;
  imageEmoji: string;
  category: string;
}

export interface CartLine {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
}
