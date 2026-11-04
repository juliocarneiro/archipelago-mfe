/**
 * O que o shell recebe quando faz `import('catalog/App')`.
 *
 * `createBridgeComponent` (do MF 2.0) embrulha o App num objeto { render, destroy }.
 * O shell não renderiza nosso componente dentro da árvore React DELE: ele chama
 * `render({ dom, basename, ...props })` e nós criamos uma raiz React própria.
 *
 * Benefícios:
 *  - Ciclo de vida isolado (mount/unmount explícitos).
 *  - O host não precisa saber que somos React — dá pra trocar por Vue amanhã.
 *  - Um erro de render aqui não derruba a árvore do shell.
 */
import { createBridgeComponent } from '@module-federation/bridge-react/v19';
import { App } from './App';

export default createBridgeComponent({
  rootComponent: App,
});
