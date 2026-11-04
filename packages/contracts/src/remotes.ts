import type { User } from './domain';

/**
 * CONTRATOS DOS REMOTES (props que o shell passa para cada MFE).
 *
 * Abordagem "contract-first": o tipo vive num pacote neutro, versionado, e
 * tanto o host quanto o remote dependem dele. Assim o TypeScript acusa
 * quebra de contrato no build de qualquer um dos lados.
 *
 * (Alternativa: o plugin de DTS do Module Federation gera tipos a partir do
 * remote em execução. Veja docs/05-contratos-e-tipagem.md para o trade-off.)
 */

/** Props comuns a todo MFE de "aplicação" montado pelo shell. */
export interface MfeAppProps {
  /** Caminho base onde o shell montou este MFE (ex.: "/catalog"). */
  basename: string;
  user: User | null;
}

export type CatalogAppProps = MfeAppProps;
export type CartAppProps = MfeAppProps;

/** Widget pequeno (component-level remote) exibido no header do shell. */
export interface CartBadgeProps {
  onClick?: () => void;
}
