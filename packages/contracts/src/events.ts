import type { CartLine, Product } from './domain';

/**
 * CATÁLOGO DE EVENTOS entre micro frontends.
 *
 * Regra de ouro: MFEs se comunicam por EVENTOS (fatos que aconteceram ou
 * intenções), não chamando funções uns dos outros. Isso mantém o acoplamento
 * baixo: o catálogo não sabe que o carrinho existe; ele só anuncia
 * "o usuário quer adicionar X".
 *
 * Convenção de nome: `<dominio>:<acao>`.
 * Evolução: nunca remova/renomeie campos de um evento existente — crie um novo
 * (ex.: `cart:updated.v2`) e deprecie o antigo. Contratos são APIs públicas.
 */
export interface MfeEventMap {
  /** Intenção: alguém (ex.: catálogo) pede para adicionar um produto ao carrinho. */
  'cart:add-requested': { product: Product; quantity: number };
  /** Fato: o carrinho mudou. Publicado APENAS pelo MFE do carrinho (dono do estado). */
  'cart:updated': { lines: CartLine[]; totalItems: number; totalInCents: number };
  /** Fato: sessão mudou. Publicado APENAS pelo shell (dono da autenticação). */
  'auth:changed': { userId: string | null };
  /** Pedido de navegação para o shell (um MFE não manipula o router de outro). */
  'shell:navigate': { to: string };
}

export type MfeEventName = keyof MfeEventMap;
