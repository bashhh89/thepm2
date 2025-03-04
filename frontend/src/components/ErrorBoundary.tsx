import React from 'react';
import { Button } from './Button';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = 'An unexpected error occurred';
  let errorDetails = '';
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
    errorDetails = error.data?.message || '';
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-900/10 to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-sm bg-card/50 border border-purple-800/20 rounded-lg p-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-destructive">Oops! Something went wrong</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>

        {errorDetails && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-md p-4 text-sm text-destructive/80 font-mono overflow-auto max-h-48">
            {errorDetails}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
          >
            Reload Page
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="border-purple-800/20 hover:bg-purple-900/10"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}