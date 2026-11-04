// @ts-check
import { readFileSync } from 'node:fs';

/**
 * `workspace:*` é um protocolo do pnpm, não semver. Em runtime o Module Federation
 * compara versões semver, então traduzimos para `^<versão atual do pacote>`.
 * Isso importa quando os MFEs forem deployados em momentos diferentes: um remote
 * buildado com @mfe/ui 1.x não deve aceitar um @mfe/ui 2.x (breaking change).
 *
 * @param {string} name
 * @param {string | undefined} range
 * @returns {string | false}
 */
function resolveRange(name, range) {
  if (!range) return false;
  if (!range.startsWith('workspace:')) return range;
  const dir = name.replace('@mfe/', '');
  const pkgUrl = new URL(`../${dir}/package.json`, import.meta.url);
  const { version } = JSON.parse(readFileSync(pkgUrl, 'utf8'));
  return `^${version}`;
}

/**
 * Configuração de Module Federation compartilhada por TODOS os MFEs.
 *
 * Por que centralizar?
 *  - `shared` precisa ser coerente entre host e remotes. Se o shell declara
 *    React como singleton e um remote não, você pode acabar com 2 Reacts na
 *    página ("Invalid hook call").
 *  - Ter as URLs dos remotes num só lugar facilita trocar por ambiente
 *    (local, staging, produção) via variáveis de ambiente.
 */

/** Portas de desenvolvimento de cada MFE. */
export const ports = {
  shell: 4000,
  catalog: 4001,
  cart: 4002,
};

/**
 * Fontes da plataforma, injetadas no <head> pelo Rsbuild (`html.tags`).
 * Só documentos HTML carregam fontes: o shell e os remotes em standalone.
 * Um remote federado herda as fontes da página do shell.
 */
const fontsHref =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@400;500&family=Schibsted+Grotesk:wght@400..700&display=swap';

export const fontTags = [
  { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
  { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
  { tag: 'link', attrs: { rel: 'stylesheet', href: fontsHref } },
];

/**
 * Origens que podem buscar os assets dos remotes (CORS).
 * Em produção isso é configurado no CDN (ex.: só https://app.suaempresa.com).
 */
export const allowedOrigins = Object.values(ports).flatMap((port) => [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`,
]);

/**
 * Opções de Module Federation comuns a host e remotes.
 *
 *  - shareStrategy 'loaded-first': CRÍTICO para resiliência. O padrão
 *    ('version-first') baixa o manifest de TODOS os remotes no boot para escolher
 *    a maior versão de cada dependência compartilhada. Resultado: se UM remote
 *    estiver fora do ar, a página inteira fica em branco. Com 'loaded-first', o
 *    shell usa o que já carregou e só busca um remote quando ele é usado.
 *  - dts: false → tipos vêm de @mfe/contracts (contract-first, ADR-0004).
 *  - bridge.enableBridgeRouter: false → o basename chega explícito via props,
 *    sem alias "mágico" do react-router.
 */
export const federationDefaults = /** @type {const} */ ({
  shareStrategy: 'loaded-first',
  dts: false,
  bridge: { enableBridgeRouter: false },
});

/**
 * Dependências compartilhadas em runtime.
 *  - singleton: só pode existir UMA instância na página (obrigatório p/ React,
 *    react-dom, router e qualquer lib com estado global/context).
 *  - requiredVersion: faixa semver aceita. Se o host oferecer uma versão fora da
 *    faixa, o MF avisa no console (e, com strictVersion, falha).
 *
 * @param {Record<string, string>} deps - `dependencies` do package.json do app
 */
export function createShared(deps) {
  /** @param {string} name */
  const singleton = (name) => ({
    singleton: true,
    requiredVersion: resolveRange(name, deps[name]),
  });

  return {
    react: singleton('react'),
    'react-dom': singleton('react-dom'),
    'react-router': singleton('react-router'),
    // Pacotes internos: compartilhados para que o design system e o event bus
    // sejam carregados UMA vez, mesmo com vários MFEs na tela.
    '@mfe/ui': singleton('@mfe/ui'),
    '@mfe/contracts': singleton('@mfe/contracts'),
  };
}

/**
 * Endereço do manifest de um remote, no formato `nome@url`.
 * Em produção, cada time publica seu remote num CDN e o pipeline injeta
 * PUBLIC_<NOME>_URL no build do shell.
 *
 * O manifest (mf-manifest.json) é preferível ao remoteEntry.js porque traz
 * metadados (versão, assets, shared) que permitem preload e devtools.
 *
 * @param {'catalog' | 'cart'} name
 */
export function remoteManifest(name) {
  return `${name}@${remoteOrigin(name)}/mf-manifest.json`;
}

/**
 * URL base de um remote (sem barra final).
 * @param {'catalog' | 'cart'} name
 */
export function remoteOrigin(name) {
  const envKey = `PUBLIC_${name.toUpperCase()}_URL`;
  const base = process.env[envKey] ?? `http://localhost:${ports[name]}`;
  return base.replace(/\/$/, '');
}
