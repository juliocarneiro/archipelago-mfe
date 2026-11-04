import type { DestroyParams, RenderParams } from '@module-federation/bridge-react/base';

/**
 * Formato do objeto exportado por `createBridgeComponent` num remote.
 * O genérico `Props` é só documental: o bridge repassa as props extras para o
 * `rootComponent` do remote.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type BridgeProvider<Props> = () => {
  render(info: RenderParams): Promise<void>;
  destroy(info: DestroyParams): void;
};
