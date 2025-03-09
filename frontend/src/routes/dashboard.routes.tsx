import { RouteObject } from 'react-router-dom';
import { DashboardMainLayout } from '../components/DashboardMainLayout';
import { lazy } from 'react';

// Lazy load dashboard pages
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const JobPostings = lazy(() => import('../pages/dashboard/JobPostings'));
const Candidates = lazy(() => import('../pages/dashboard/Candidates'));
const TalentPool = lazy(() => import('../pages/dashboard/TalentPool'));
const Companies = lazy(() => import('../pages/dashboard/Companies'));
const Interviews = lazy(() => import('../pages/dashboard/Interviews'));
const Assessments = lazy(() => import('../pages/dashboard/Assessments'));
const Messages = lazy(() => import('../pages/dashboard/Messages'));
const Analytics = lazy(() => import('../pages/dashboard/Analytics'));
const Reports = lazy(() => import('../pages/dashboard/Reports'));
const EmailTemplates = lazy(() => import('../pages/dashboard/EmailTemplates'));
const AgencyProfile = lazy(() => import('../pages/dashboard/AgencyProfile'));
const CareerSite = lazy(() => import('../pages/dashboard/CareerSite'));
const Settings = lazy(() => import('../pages/dashboard/Settings'));

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardMainLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'jobs', element: <JobPostings /> },
      { path: 'candidates', element: <Candidates /> },
      { path: 'talent-pool', element: <TalentPool /> },
      { path: 'companies', element: <Companies /> },
      { path: 'interviews', element: <Interviews /> },
      { path: 'assessments', element: <Assessments /> },
      { path: 'messages', element: <Messages /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'reports', element: <Reports /> },
      { path: 'email-templates', element: <EmailTemplates /> },
      { path: 'agency', element: <AgencyProfile /> },
      { path: 'career-site', element: <CareerSite /> },
      { path: 'settings', element: <Settings /> }
    ]
  }
];