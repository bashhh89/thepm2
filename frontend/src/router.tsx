import { lazy, type ReactNode, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { userRoutes } from "./user-routes";

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      {children}
    </Suspense>
  );
};

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(
  () => import("./pages/SomethingWentWrongPage"),
);

// Wait for Puter to be ready with timeout
const waitForPuterReady = async () => {
  const maxWaitTime = 10000; // 10 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    if (window.puter?.isReady) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
};

// Initialize router with Puter.js check
const initializeRouter = async () => {
  try {
    // Try to initialize Puter.js first
    await waitForPuterReady();
    console.log('Puter.js initialized successfully');
  } catch (error) {
    console.warn('Puter.js initialization failed:', error);
    // Continue anyway - features will degrade gracefully
  }
};

// Initialize on router creation
initializeRouter().catch(console.error);

export const router = createBrowserRouter(
  [
    ...userRoutes,
    {
      path: "*",
      element: (
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      ),
      errorElement: (
        <SuspenseWrapper>
          <SomethingWentWrongPage />
        </SuspenseWrapper>
      ),
    },
  ]
);