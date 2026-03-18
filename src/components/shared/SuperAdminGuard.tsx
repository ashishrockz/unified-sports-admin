import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

export default function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== 'superadmin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
