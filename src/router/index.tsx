import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AuthGuard from '../components/shared/AuthGuard';
import SuperAdminGuard from '../components/shared/SuperAdminGuard';

import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import MatchesPage from '../pages/matches/MatchesPage';
import RoomsPage from '../pages/rooms/RoomsPage';
import AdminsPage from '../pages/admins/AdminsPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SportTypesPage from '../pages/sport-types/SportTypesPage';
import ApiKeysPage from '../pages/api-keys/ApiKeysPage';
import AuditLogsPage from '../pages/audit-logs/AuditLogsPage';
import SubscriptionPage from '../pages/subscription/SubscriptionPage';
import AppConfigPage from '../pages/app-config/AppConfigPage';
import ClientPage from '../pages/client/ClientPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'matches', element: <MatchesPage /> },
      { path: 'rooms', element: <RoomsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'sport-types', element: <SportTypesPage /> },
      { path: 'api-keys', element: <ApiKeysPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'subscription', element: <SubscriptionPage /> },
      { path: 'app-config', element: <AppConfigPage /> },
      { path: 'client', element: <ClientPage /> },
      {
        path: 'admins',
        element: (
          <SuperAdminGuard>
            <AdminsPage />
          </SuperAdminGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
