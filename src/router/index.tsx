import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AuthGuard from '../components/guards/AuthGuard';
import PermissionGuard from '../components/guards/PermissionGuard';

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
import AuditLogsPage from '../pages/audit-logs/AuditLogsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import AppConfigPage from '../pages/app-config/AppConfigPage';
import UnauthorizedPage from '../pages/unauthorized/UnauthorizedPage';

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
      { path: 'profile', element: <ProfilePage /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
      {
        path: 'users',
        element: (
          <PermissionGuard permissions={['users.read']}>
            <UsersPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'matches',
        element: (
          <PermissionGuard permissions={['matches.read']}>
            <MatchesPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'rooms',
        element: (
          <PermissionGuard permissions={['rooms.read']}>
            <RoomsPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'analytics',
        element: (
          <PermissionGuard permissions={['reports.read']}>
            <AnalyticsPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'sport-types',
        element: (
          <PermissionGuard permissions={['sport_types.read']}>
            <SportTypesPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'notifications',
        element: (
          <PermissionGuard permissions={['notifications.read']}>
            <NotificationsPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'audit-logs',
        element: (
          <PermissionGuard permissions={['audit_logs.read']}>
            <AuditLogsPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <PermissionGuard permissions={['settings.read']}>
            <AppConfigPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'app-config',
        element: <Navigate to="/settings" replace />,
      },
      {
        path: 'system-config',
        element: (
          <PermissionGuard permissions={['system_config.read']}>
            <AppConfigPage />
          </PermissionGuard>
        ),
      },
      {
        path: 'admins',
        element: (
          <PermissionGuard permissions={['admins.read']}>
            <AdminsPage />
          </PermissionGuard>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
