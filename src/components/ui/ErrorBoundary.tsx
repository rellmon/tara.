import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import Button from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  confirmingReset: boolean
}

// Removes only Tara's own saved data, then returns to the home page.
function resetSavedData() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('tara.'))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage may be blocked. Nothing more we can do.
  }
  window.location.assign('/')
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, confirmingReset: false }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true, confirmingReset: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Tara hit an unexpected error:', error, info.componentStack)
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, confirmingReset: false })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center" role="alert">
          <p className="font-display text-3xl font-bold text-brand-600">tara.</p>
          <h1 className="mt-6 font-display text-2xl font-bold text-brand-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-muted">
            Tara hit an unexpected error. Your trips are still saved on this
            device. Try again, or go back home.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={this.handleTryAgain}>
              Try again
            </Button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-sage px-4 py-2 text-sm font-medium text-brand-900 transition-colors hover:bg-sage-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Go to home
            </a>
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <p className="text-sm text-muted">
              Still broken after trying again? Saved data may be damaged.
            </p>
            {this.state.confirmingReset ? (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-700">
                  This deletes all trips and data saved on this device. It can't
                  be undone.
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-3">
                  <Button type="button" variant="danger" onClick={resetSavedData}>
                    Yes, delete and reset
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => this.setState({ confirmingReset: false })}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="mt-2"
                onClick={() => this.setState({ confirmingReset: true })}
              >
                Reset saved data
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary