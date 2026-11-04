/** Junta classes ignorando valores falsy. (Em projetos maiores: clsx + tailwind-merge.) */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
