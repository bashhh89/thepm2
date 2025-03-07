import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="p-6 max-w-lg mx-auto my-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Oops, something went wrong!</h2>
            <p className="text-muted-foreground">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button variant="outline" onClick={this.handleReset}>
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}