import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Phone, MessageSquare, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetPath = () => {
    window.location.hash = '/';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans relative">
          <div className="absolute top-1/3 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-lg w-full bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 p-8 shadow-2xl relative z-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-navy flex items-center justify-center mx-auto border-2 border-brand-orange text-brand-orange shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/30">
                System Resilience Catch
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-3">
                Operational Session Recovery
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                An unexpected interface exception occurred. The underlying database and active consignments remain safe and uninterrupted.
              </p>
            </div>

            {/* Error Message Details (Collapsible) */}
            {this.state.error && (
              <details className="text-left bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs font-mono text-slate-400">
                <summary className="cursor-pointer text-brand-orange font-semibold select-none">
                  Technical Diagnostics
                </summary>
                <div className="mt-2 text-rose-300 whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Interface</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetPath}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
              >
                Return to Home
              </button>
            </div>

            {/* Emergency Operations Contact */}
            <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span>Direct Emergency Desk:</span>
              <div className="flex items-center gap-3">
                <a
                  href="tel:+917906308640"
                  className="font-bold text-white hover:text-brand-orange flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-orange" />
                  +91 7906308640
                </a>
                <a
                  href="https://wa.me/917906308640"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
