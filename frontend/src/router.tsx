import { lazy, type ReactNode, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { userRoutes } from "./user-routes";

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      {children}
    </Suspense>
  );
};

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(() => import("./pages/SomethingWentWrongPage"));

export const router = createBrowserRouter([
  // Redirect legacy /login and /register routes to new auth routes
  {
    path: '/login',
    element: <Navigate to="/sign-in" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/sign-up" replace />,
  },
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
]);