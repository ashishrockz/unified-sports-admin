import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import type { Permission } from '../../config/permissions';
import { hasAnyPermission } from '../../config/permissions';

interface PermissionGuardProps {
  permissions: Permission[];
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PermissionGuard({ permissions, children, redirectTo = '/unauthorized' }: PermissionGuardProps) {
  const role = useAuthStore((s) => s.user?.role);

  if (!role || !hasAnyPermission(role, permissions)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
