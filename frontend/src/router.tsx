import { lazy, type ReactNode, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorBoundary } from './components/ErrorBoundary';
import ContentPage from './components/ContentPage';

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      {children}
    </Suspense>
  );
};

// Lazy load components
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(() => import("./pages/SomethingWentWrongPage"));

// Import userRoutes after component declarations
import { userRoutes } from "./user-routes";

// Define static routes first
const staticRoutes = [
  {
    path: '/login',
    element: <Navigate to="/sign-in" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/sign-up" replace />,
  },
  {
    path: 'pages/:category/:page',
    element: (
      <SuspenseWrapper>
        <ContentPage />
      </SuspenseWrapper>
    ),
    errorElement: <ErrorBoundary />
  },
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
  }
];

// Create and export the router with proper order
export const router = createBrowserRouter([
  ...staticRoutes,
  ...userRoutes
]);