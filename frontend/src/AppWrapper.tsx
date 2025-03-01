import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Head } from "./internal-components/Head";
import { ThemeProvider } from "./internal-components/ThemeProvider";
import { DEFAULT_THEME } from "./constants/default-theme";
import { FloatingChatButton } from "./components/FloatingChatButton";
import { startTransition, useEffect, useState } from "react";
import { PipelineProvider } from "./contexts/PipelineContext";
import { ClerkProvider } from "@clerk/clerk-react";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
        <pre className="mb-4 rounded bg-muted p-4 text-sm">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const AppWrapper = () => {
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    startTransition(() => {
      setIsPending(false);
    });
  }, []);

  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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
          {isPending ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-lg">Loading application...</div>
            </div>
          ) : (
            <PipelineProvider>
              <RouterProvider router={router} />
              <Head />
              <FloatingChatButton />
            </PipelineProvider>
          )}
        </ErrorBoundary>
      </ThemeProvider>
    </ClerkProvider>
  );
}
