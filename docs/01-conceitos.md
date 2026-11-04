# 01 — O que são micro frontends

## O problema

Num frontend monolítico grande, com vários times, aparecem sempre os mesmos sintomas:

- **Deploy acoplado:** o time de checkout não consegue lançar uma correção porque o
  release está bloqueado por um bug do time de busca.
- **Build e CI lentos:** cada PR roda testes e build de tudo.
- **Fronteiras que erodem:** "só um import" do módulo do outro time vira acoplamento que
  ninguém consegue desfazer.
- **Upgrade impossível:** migrar de React 17 para 18 exige coordenar 10 times de uma vez.

Micro frontends aplicam ao frontend a ideia de microsserviços: **dividir por domínio de
negócio, com um time dono de ponta a ponta** (UI, dados, deploy).

> Micro frontend é antes de tudo uma decisão **organizacional**. A tecnologia
> (Module Federation) é só o meio.

## Quando NÃO usar

Seja honesto aqui — numa entrevista, saber quando _não_ usar vale mais do que saber configurar:

- **Um ou dois times:** o custo (infra, contratos, coordenação de versões) supera o ganho.
  Um monorepo bem modularizado resolve.
- **Produto pequeno ou em descoberta:** fronteiras de domínio ainda mudam toda semana.
  Dividir cedo congela fronteiras erradas.
- **Performance extrema como requisito número 1:** MFE adiciona requests e runtime.
  Dá para mitigar, mas não é de graça.

Regra prática: considere MFE quando **times diferentes precisam lançar em ritmos diferentes**
e o atrito de coordenação já é um problema medido, não hipotético.

## Formas de compor micro frontends

| Abordagem                          | Como funciona                              | Prós                                      | Contras                                     |
| ---------------------------------- | ------------------------------------------ | ----------------------------------------- | ------------------------------------------- |
| **Build-time** (pacotes npm)       | Cada MFE é um pacote; o host instala       | Simples, tipado                           | Deploy NÃO é independente (rebuild do host) |
| **Server-side** (SSI/ESI, edge)    | Servidor costura HTML de fragmentos        | Ótimo para SEO e first paint              | Interatividade entre fragmentos é difícil   |
| **iframes**                        | Cada MFE numa iframe                       | Isolamento total                          | UX ruim (scroll, modais, a11y, deep links)  |
| **Web Components**                 | Cada MFE é um custom element               | Agnóstico de framework                    | Dependências duplicadas, SSR complexo       |
| **Runtime JS (Module Federation)** | Host baixa o código dos remotes em runtime | Deploy independente + deps compartilhadas | Exige disciplina com versões e contratos    |
| **Meta-frameworks** (single-spa)   | Orquestrador monta/desmonta apps por rota  | Maduro, multi-framework                   | Mais uma camada; MF já cobre muito disso    |

O Archipelago usa **runtime JS com Module Federation 2.0**, que é hoje a escolha dominante
no mercado para SPAs React em empresas com vários times.

## Vocabulário

- **Host / shell / container:** a aplicação que o usuário abre e que monta as outras.
- **Remote:** uma aplicação que expõe módulos para serem carregados por outras.
- **Exposed module:** o que um remote publica (`./App`, `./CartBadge`). É a API pública dele.
- **Shared dependency:** uma lib que host e remotes concordam em carregar UMA vez (React).
- **App-level remote:** o remote entrega uma aplicação inteira, com ciclo de vida próprio.
- **Component-level remote:** o remote entrega um componente que roda dentro da árvore do host.
- **Vertical split:** dividir por domínio/rota (catálogo, carrinho) — o recomendado.
- **Horizontal split:** vários MFEs na mesma tela (o badge do carrinho no header) — use com
  moderação, porque aumenta a coordenação.

Próximo: [02 — Arquitetura do projeto](./02-arquitetura.md)
