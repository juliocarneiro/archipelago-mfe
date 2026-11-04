const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** Formata centavos como moeda. Dinheiro sempre em inteiros (centavos), nunca float. */
export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}
