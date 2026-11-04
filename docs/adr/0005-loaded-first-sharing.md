# ADR-0005 — `shareStrategy: 'loaded-first'` para isolamento de falhas

- **Status:** aceito
- **Data:** 2026-11-04

## Contexto

Em teste manual, com o remote `catalog` inacessível, o shell renderizou uma **página em branco**.
O padrão `version-first` baixa o manifest de todos os remotes na inicialização para escolher a
maior versão de cada dependência compartilhada. Uma falha nessa etapa impede o carregamento do
React compartilhado — e portanto do próprio shell.

## Decisão

`shareStrategy: 'loaded-first'` em todos os apps (via `federationDefaults`). O shell fornece as
dependências compartilhadas; remotes só são buscados quando usados.

## Consequências

- ✅ Um remote fora do ar afeta só a sua ilha (coberto por teste E2E).
- ✅ Menos requests no boot.
- ⚠️ Não se escolhe automaticamente a "maior versão" entre todos os remotes: o shell manda. Isso é
  desejável aqui, mas exige que os remotes aceitem a faixa de versão do shell (`requiredVersion`).
