# ADR-0006 — Tailwind v4 com tema compartilhado e preflight só no shell

- **Status:** aceito (substitui CSS Modules da versão inicial)
- **Data:** 2026-11-04

## Contexto

Queríamos produtividade de utilitários e um visual consistente, sem que o CSS de um MFE altere a
página de outro.

## Decisão

- Tema único em `@mfe/ui/theme.css` (`@theme`), importado por todos.
- Shell importa Tailwind completo (com preflight). Remotes federados importam só `theme` +
  `utilities`. Em standalone, o remote importa preflight via `standalone.css`.
- Mesma versão do Tailwind em todos os apps; se divergir, usar `prefix()` no remote.

## Consequências

- ✅ Classes idênticas entre MFEs → duplicatas inofensivas, sem colisão.
- ✅ Mudança de token propaga para todos no próximo build.
- ⚠️ CSS de utilitários duplicado entre MFEs (alguns KB) — aceitável.
- ⚠️ Versões do Tailwind precisam subir juntas (grupo no Dependabot).
