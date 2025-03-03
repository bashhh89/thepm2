import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Head } from "./internal-components/Head";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { DEFAULT_THEME } from "./constants/default-theme";
import { FloatingChatButton } from "./components/FloatingChatButton";
import { startTransition, useEffect, useState } from "react";
import { PipelineProvider } from "./contexts/PipelineContext";
import { createClient } from '@supabase/supabase-js';
import { useAuthSync } from './utils/auth-store';

const supabaseUrl = 'https://vzqythwfrmjakhvmopyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTkwMDQsImV4cCI6MjA1NjU5NTAwNH0.QZRgjjtxLlXsH-6U_bGDb62TfZvtkyIycM1LPapjZ28';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <pre className="text-sm text-red-500 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}

const AppContent = () => {
  const [isPending, setIsPending] = useState(true);
  useAuthSync(); // Initialize auth synchronization

  useEffect(() => {
    // Initialize theme before transitioning
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('databutton-app-ui-theme') || DEFAULT_THEME;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    
    root.classList.remove("light", "dark");
    root.classList.add(savedTheme === "system" ? systemTheme : savedTheme);

    startTransition(() => {
      setIsPending(false);
    });
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading application...</div>
      </div>
    );
  }

  return (
    <PipelineProvider>
      <RouterProvider router={router} />
      <Head />
      <FloatingChatButton />
    </PipelineProvider>
  );
};

export const AppWrapper = () => {
  return (
    <ThemeProvider defaultTheme={DEFAULT_THEME}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          window.location.reload();
        }}
        onError={(error) => {
          console.error(
            "Caught error in AppWrapper",
            error.message,
            error.stack,
          );
        }}
      >
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
};
