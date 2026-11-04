# 05 — Contratos e tipagem

Num monolito, o compilador garante que quem chama uma função passa os argumentos certos. Em MFE,
host e remote são **buildados separadamente** e se encontram **em produção**. Sem contratos
explícitos, a primeira vez que você descobre uma quebra é no Sentry.

## Os três contratos de um MFE

1. **Módulos expostos** — `./App`, `./CartBadge` (nome e formato do export).
2. **Props** — o que o host passa (`MfeAppProps`, `CartBadgeProps`).
3. **Eventos** — nome e payload (`MfeEventMap`).

Todos vivem em `packages/contracts`.

## Contract-first (o que usamos)

- Os tipos são escritos à mão num pacote neutro.
- O remote implementa: `export function App({ basename, user }: CatalogAppProps)`.
- O host declara o módulo remoto usando o mesmo tipo
  (`apps/shell/src/remotes/remote-modules.d.ts`).
- Mudou o contrato de forma incompatível? O **typecheck** de quem não acompanhou quebra no CI.

## Alternativa: tipos gerados pelo plugin DTS

O MF 2.0 consegue gerar `.d.ts` dos módulos expostos de cada remote, empacotar num zip e o host
baixa durante o dev/build (`@mf-types/`). É ótimo quando os remotes são de outros repositórios.

|                                           | Contract-first               | DTS gerado                  |
| ----------------------------------------- | ---------------------------- | --------------------------- |
| Fonte da verdade                          | pacote de contratos          | implementação do remote     |
| Typecheck do host precisa do remote no ar | não                          | sim (ou cache de tipos)     |
| Esforço                                   | escrever tipos à mão         | zero                        |
| Melhor para                               | monorepo, contratos estáveis | multi-repo, muitos expostos |

Aqui desligamos (`dts: false` em `federationDefaults`) para o CI ser determinístico. Leia o
[ADR-0004](./adr/0004-contract-first-types.md).

## Evoluindo contratos sem quebrar produção

Como host e remotes são deployados em momentos diferentes, **toda mudança precisa ser
compatível com a versão anterior do outro lado** por um tempo.

- **Adicionar** campo opcional em props/evento: seguro.
- **Remover/renomear** campo: nunca direto. Faça em 3 passos (expand → migrate → contract):
  1. Adicione o novo campo/evento (`cart:updated.v2`) mantendo o antigo.
  2. Migre todos os consumidores.
  3. Remova o antigo quando nenhum consumidor em produção depender dele.
- **Módulo exposto:** mesma lógica. Exponha `./AppV2` ao lado de `./App` durante a transição.

Testes de contrato ajudam: `apps/catalog/src/App.test.tsx` verifica que o payload publicado tem
o formato que o carrinho espera.

Próximo: [06 — Estilos e CSS](./06-estilos-e-css.md)
