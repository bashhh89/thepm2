import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertCircle, MessageSquare } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ChatErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chat error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6">
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <MessageSquare className="h-12 w-12 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Chat Assistant Unavailable</h3>
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message || 'The chat assistant is currently unavailable. Please try again later.'}
              </p>
            </div>
            {this.props.onRetry && (
              <Button 
                onClick={this.props.onRetry}
                className="flex items-center gap-2"
              >
                Try Again
              </Button>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}