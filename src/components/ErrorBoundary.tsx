import { Component } from "react"
import type { ReactNode, ErrorInfo } from "react"
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react"

interface Props {
  children: ReactNode
  fallbackTitle?: string
  onReset?: () => void
  showBack?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-[300px] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-[var(--text-md)] font-semibold text-[var(--text-primary)]">
            {this.props.fallbackTitle || "Something went wrong"}
          </h2>
          {import.meta.env.DEV && this.state.error && (
            <p className="mt-2 rounded-[var(--radius-md)] bg-red-50 px-3 py-2 font-mono text-[11px] text-red-600">
              {this.state.error.message}
            </p>
          )}
          <div className="mt-5 flex items-center justify-center gap-2">
            {this.props.showBack && (
              <a
                href="/funnel-builder"
                className="flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white px-4 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
              </a>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] px-4 text-[13px] font-semibold text-white transition-colors"
              style={{ background: "var(--brand)" }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Try again
            </button>
          </div>
        </div>
      </div>
    )
  }
}
