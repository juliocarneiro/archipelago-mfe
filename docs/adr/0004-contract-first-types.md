# ADR-0004 — Tipos contract-first em vez de tipos gerados dos remotes

- **Status:** aceito
- **Data:** 2026-11-04

## Contexto

`import('catalog/App')` não existe em disco; o TypeScript precisa saber o formato. O MF 2.0 oferece
um plugin DTS que gera tipos a partir do remote e os distribui num zip.

## Decisão

Contratos escritos à mão em `@mfe/contracts` (props, eventos, domínio) e declarações de módulo no
shell (`remote-modules.d.ts`) baseadas neles. `dts: false` no MF.

## Consequências

- ✅ Typecheck determinístico: não depende de remotes no ar nem de download de tipos no CI.
- ✅ O contrato é um artefato revisado (CODEOWNERS da plataforma), não efeito colateral.
- ⚠️ Precisa manter declarações sincronizadas manualmente (pouco código).
- 🔁 Em multi-repo com muitos módulos expostos, reavaliar o plugin DTS.
