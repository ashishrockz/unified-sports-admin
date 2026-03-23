import { useAuthStore } from '../../stores/auth.store';
import { hasPermission, type Permission } from '../../config/permissions';

interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function Can({ permission, children, fallback = null }: CanProps) {
  const role = useAuthStore((s) => s.user?.role);

  if (!role || !hasPermission(role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
