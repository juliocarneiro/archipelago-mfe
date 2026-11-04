import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState, Spinner } from '@mfe/ui';

interface Props {
  /** Nome amigável do MFE, usado na mensagem de erro e na telemetria. */
  name: string;
  children: ReactNode;
  /** Mude esta key para forçar o remount (ex.: botão "tentar novamente"). */
  onRetry?: () => void;
  /** Fallback compacto (ex.: widgets no header não devem mostrar um card grande). */
  compactFallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * ISOLAMENTO DE FALHAS.
 * Cada remote é embrulhado num Error Boundary + Suspense. Se o CDN do carrinho
 * cair, ou o código dele lançar erro, SÓ aquele pedaço da tela mostra o erro —
 * o resto da plataforma segue funcionando. Este é um dos maiores benefícios
 * (e responsabilidades) de uma arquitetura MFE.
 */
export class RemoteBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Ponto de integração com Sentry/Datadog: tag com o nome do MFE para
    // saber QUAL time precisa ser acionado.
    console.error(`[mfe:${this.props.name}] falhou ao renderizar`, error, info.componentStack);
  }

  private retry = () => {
    this.setState({ error: null });
    this.props.onRetry?.();
  };

  override render() {
    if (this.state.error) {
      if (this.props.compactFallback !== undefined) return this.props.compactFallback;
      return (
        <ErrorState
          title={`${this.props.name} is unavailable right now`}
          description="The rest of the page keeps working. This island failed to load or crashed while rendering."
          onRetry={this.retry}
        />
      );
    }
    return (
      <Suspense
        fallback={this.props.compactFallback ?? <Spinner label={`Loading ${this.props.name}…`} />}
      >
        {this.props.children}
      </Suspense>
    );
  }
}
