import { lazy, type ReactNode, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { userRoutes } from "./user-routes";
import { ErrorBoundary } from './components/ErrorBoundary';
import ContentPage from './components/ContentPage';

export const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-4">Loading...</div>}>
      {children}
    </Suspense>
  );
};

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SomethingWentWrongPage = lazy(() => import("./pages/SomethingWentWrongPage"));
const Profile = lazy(() => import('./pages/Profile'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const DocumentViewPage = lazy(() => import('./pages/DocumentViewPage'));

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
  },
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'profile',
        element: <Profile />,
        errorElement: <ErrorBoundary />
      },
      {
        path: 'admin',
        children: [
          {
            path: 'login',
            element: <AdminLogin />,
            errorElement: <ErrorBoundary />
          },
          {
            path: 'dashboard',
            element: <AdminDashboard />,
            errorElement: <ErrorBoundary />
          }
        ]
      },
      {
        path: 'dashboard',
        children: [
          {
            path: 'analytics',
            element: <AnalyticsPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: 'documents',
            element: <DocumentsPage />,
            errorElement: <ErrorBoundary />
          },
          {
            path: 'documents/:id',
            element: <DocumentViewPage />,
            errorElement: <ErrorBoundary />
          }
        ]
      }
    ]
  }
]);