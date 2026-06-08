import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-elk-canvas flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} className="text-elk-red" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-sm text-gray-500 mb-6">
            An unexpected error occurred. You can try reloading the page.
          </p>
          {this.state.message && (
            <p className="text-xs font-mono text-gray-400 bg-gray-50 rounded-lg px-4 py-2 mb-6 break-all">
              {this.state.message}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-elk-red hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-900/20"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
