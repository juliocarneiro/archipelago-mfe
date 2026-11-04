import type { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

/**
 * RUNTIME PLUGIN DA PLATAFORMA (roda no browser, dentro do runtime do MF).
 *
 * 1) OVERRIDES DE REMOTE (o "superpoder" de MFE em QA/dev):
 *    Aponte qualquer remote para outra URL SEM rebuildar o shell. Ex.: testar o
 *    catálogo de um PR contra o shell de produção. No console:
 *
 *      localStorage.setItem('mfe:overrides', JSON.stringify({
 *        catalog: 'https://pr-123.catalog.preview.suaempresa.com/mf-manifest.json'
 *      }))
 *
 *    ⚠️ Em produção, restrinja isso (ex.: só com cookie de funcionário, ou só
 *    para URLs de domínios confiáveis). Veja ALLOWED_OVERRIDE_HOSTS.
 *
 * 2) TELEMETRIA: todo erro de carregamento de remote passa por aqui — o lugar
 *    certo para mandar para Sentry/Datadog com o nome do remote.
 */

const OVERRIDES_KEY = 'mfe:overrides';
const ALLOWED_OVERRIDE_HOSTS = ['localhost', '127.0.0.1'];

function readOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed).filter(([, url]) => {
        const allowed = ALLOWED_OVERRIDE_HOSTS.includes(new URL(url).hostname);
        if (!allowed) console.warn(`[mfe] override ignorado (host não permitido): ${url}`);
        return allowed;
      }),
    );
  } catch {
    return {};
  }
}

export default function platformRuntimePlugin(): ModuleFederationRuntimePlugin {
  return {
    name: 'mfe-platform-runtime-plugin',

    beforeInit(args) {
      const overrides = readOverrides();
      const remotes = args.userOptions.remotes ?? [];
      for (const remote of remotes) {
        const override = overrides[remote.name];
        if (override && 'entry' in remote) {
          console.info(`[mfe] override ativo: ${remote.name} → ${override}`);
          remote.entry = override;
        }
      }
      return args;
    },

    async errorLoadRemote({ id, error, lifecycle }) {
      console.error(`[mfe] falha ao carregar "${id}" (etapa: ${lifecycle})`, error);
      // Não devolvemos fallback aqui: deixamos o erro subir até o
      // RemoteBoundary/bridge fallback, que mostra a UI de erro com "tentar novamente".
      throw error;
    },
  };
}
