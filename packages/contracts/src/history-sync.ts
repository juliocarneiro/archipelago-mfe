/**
 * SINCRONIZAÇÃO DE HISTÓRICO ENTRE ROUTERS.
 *
 * Problema: no modelo "app-level remote", o shell tem um router e cada MFE
 * montado tem o SEU router (cada um é dono das próprias rotas internas). Os
 * dois leem `window.location`, mas um `history.pushState` feito por um router
 * NÃO dispara evento nenhum — o outro router fica desatualizado.
 *
 * Solução simples e agnóstica de framework: depois de cada navegação, quem
 * navegou dispara um `popstate` sintético. Todo router (React Router, Vue
 * Router, Angular...) já escuta `popstate` e se re-sincroniza com a URL.
 *
 * O guard por `href` evita loop: quando o outro router reage ao popstate e
 * chama esta função de volta, a URL é a mesma e nada é disparado.
 */
let lastNotifiedHref: string | null = null;

export function notifyLocationChange(): void {
  const href = globalThis.location.href;
  if (href === lastNotifiedHref) return;
  lastNotifiedHref = href;
  globalThis.dispatchEvent(new PopStateEvent('popstate', { state: globalThis.history.state }));
}
