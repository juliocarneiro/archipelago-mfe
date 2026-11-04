# Guia de estudo — Micro Frontends com o Archipelago

Este guia foi escrito para quem já tem experiência sólida com frontend e quer entender
micro frontends (MFE) de verdade: não só "como configurar", mas **por que** cada decisão
existe e **o que quebra** quando você a ignora.

Leia nesta ordem. Cada capítulo aponta para os arquivos do projeto onde o conceito está
implementado — abra o código ao lado.

| #   | Capítulo                                                 | O que você aprende                                             |
| --- | -------------------------------------------------------- | -------------------------------------------------------------- |
| 01  | [O que são micro frontends](./01-conceitos.md)           | Problema que resolvem, quando NÃO usar, tipos de composição    |
| 02  | [Arquitetura do projeto](./02-arquitetura.md)            | Quem é dono do quê, fluxo de boot, estrutura do monorepo       |
| 03  | [Module Federation a fundo](./03-module-federation.md)   | host/remote, exposes, shared, singleton, manifest, bridge      |
| 04  | [Comunicação entre MFEs](./04-comunicacao.md)            | Props down / events up, event bus, estado, roteamento          |
| 05  | [Contratos e tipagem](./05-contratos-e-tipagem.md)       | Contract-first, versionamento de eventos e de módulos expostos |
| 06  | [Estilos e CSS](./06-estilos-e-css.md)                   | Tailwind em MFE, preflight, colisões, prefixos                 |
| 07  | [Resiliência](./07-resiliencia.md)                       | Isolamento de falhas, shareStrategy, retry, telemetria         |
| 08  | [Testes](./08-testes.md)                                 | Pirâmide de testes em MFE, testes de contrato e de arquitetura |
| 09  | [Deploy e versionamento](./09-deploy-e-versionamento.md) | Deploy independente, CDN, cache, rollback, overrides           |
| 10  | [Armadilhas comuns](./10-armadilhas.md)                  | Bugs reais (vários encontrados construindo este projeto)       |
| 11  | [Adicionando um novo MFE](./11-novo-mfe.md)              | Passo a passo para criar a 4ª ilha                             |

Decisões arquiteturais formais estão em [`adr/`](./adr) no formato ADR (Architecture
Decision Record) — é um formato muito usado em empresas e vale a pena praticar.

## Exercícios sugeridos

Depois de ler, tente fazer (em ordem de dificuldade):

1. Adicione um evento `cart:item-removed` e faça o catálogo mostrar "no carrinho" nos cards.
2. Derrube o cart (`Ctrl+C` no terminal dele) com a página aberta e observe o que acontece.
3. Crie um MFE `account` que expõe `./App` em `/account/*` (capítulo 11).
4. Escreva um remote em **Vue** exposto via `createBridgeComponent` próprio — prova que o
   shell não depende do framework do remote.
5. Faça o deploy de cada app num lugar diferente (ex.: 3 projetos na Vercel/Netlify) e
   aponte o shell para eles com `PUBLIC_CATALOG_URL` / `PUBLIC_CART_URL`.
