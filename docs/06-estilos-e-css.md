# 06 — Estilos e CSS

CSS é global por natureza. Num monolito isso já dá trabalho; em MFE, o CSS de um time pode
quebrar a tela de outro time **em produção, sem nenhum dos dois ter mudado nada**. Precisa de regras.

## A estratégia do Archipelago (Tailwind v4)

| Arquivo                            | Quem importa             | Contém                                       |
| ---------------------------------- | ------------------------ | -------------------------------------------- |
| `packages/ui/src/styles/theme.css` | todo mundo               | `@theme` — tokens (cores, fontes, raio)      |
| `packages/ui/src/styles/base.css`  | só o dono da página      | estilos de `html`, seleção                   |
| `apps/shell/src/styles.css`        | shell                    | Tailwind **completo** (com preflight)        |
| `apps/<remote>/src/styles.css`     | módulo exposto do remote | só `theme` + `utilities`, **sem preflight**  |
| `apps/<remote>/src/standalone.css` | remote em standalone     | preflight + base (aí ele é o dono da página) |

### Regra 1 — só o dono da página reseta

O **preflight** do Tailwind é um reset global (`margin: 0` em tudo, `button` sem estilo...). Se um
remote o trouxesse junto, cada vez que ele carregasse, a página do shell seria resetada de novo.
Por isso o CSS federado de um remote importa só `tailwindcss/theme.css` e `tailwindcss/utilities.css`.

### Regra 2 — um tema, uma versão

Se catalog e cart geram `.p-4`, a regra é **idêntica** — mesma versão do Tailwind, mesmo tema.
Duplicata inofensiva. O tema vem de um lugar só (`@mfe/ui/theme.css`) e o Dependabot agrupa as
atualizações para subirem juntas.

### Regra 3 — se as versões divergirem, use prefixo

Se um dia um time precisar ficar no Tailwind 4.1 e outro ir para o 5, ative prefixo no remote:

```css
@import 'tailwindcss/utilities.css' layer(utilities) prefix(cat);
```

E as classes viram `cat:flex cat:p-4`. Feio, mas 100% isolado.

### Regra 4 — `@source` para o design system

Tailwind v4 gera só as classes que encontra no código. Os componentes de `@mfe/ui` estão fora da
pasta do app, então cada CSS declara `@source '../../../packages/ui/src'`.

## Alternativas que você vai encontrar no mercado

- **CSS Modules:** escopo por hash. Ótimo isolamento, zero runtime. (Versão anterior deste projeto
  usava, com `localIdentName` prefixado por MFE.)
- **CSS-in-JS com runtime** (styled-components, Emotion): funciona, mas cuidado — a lib precisa ser
  singleton ou cada MFE injeta seus estilos de forma independente; e custa performance.
- **Shadow DOM:** isolamento real, mas portais (modais, tooltips) e fontes ficam chatos.

## A assinatura visual: "Show boundaries"

`apps/shell/src/islands/Island.tsx` + `apps/shell/src/styles.css`. O shell envolve cada remote num
`<div data-mfe="catalog">`. Com `data-boundaries="on"` no `<html>`, um `outline` tracejado e um
`::before` com nome e origem aparecem. Repare: **os remotes não sabem disso.** Quem marca é o shell.

Próximo: [07 — Resiliência](./07-resiliencia.md)
