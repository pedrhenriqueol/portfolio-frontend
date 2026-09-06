import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    onClose?: () => void;
    fallbackTitle?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ModalErrorBoundary - Fronteira de erro para drawers e modais.
 * Impede que erros de desmonte de nós do DOM ou exceções em subcomponentes
 * derrubem a página inteira durante o scroll ou interações.
 */
export default class ModalErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.warn('[ModalErrorBoundary] Exceção capturada com sucesso:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-darker border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center font-sans">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">
                            <i className="fas fa-exclamation-triangle" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            {this.props.fallbackTitle || 'Falha ao renderizar console de detalhes'}
                        </h3>
                        <p className="text-xs text-gray-400 mb-6 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5 text-left overflow-x-auto">
                            {this.state.error?.message || 'Erro inesperado de renderização no modal.'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-accent text-darker text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
                            >
                                Fechar Console
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
