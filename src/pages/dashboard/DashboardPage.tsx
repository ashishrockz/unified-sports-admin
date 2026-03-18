import { useAuthStore } from '../../stores/auth.store';
import { useAdminDashboard, useSuperAdminDashboard } from '../../hooks/use-dashboard';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { Users, UserCheck, UserX, Ban, ShieldCheck, Swords, DoorOpen, Gamepad2 } from 'lucide-react';

export default function DashboardPage() {
  const isSuperAdmin = useAuthStore((s) => s.user?.role === 'superadmin');

  return isSuperAdmin ? <SuperAdminDashboard /> : <AdminDashboard />;
}

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const users = data?.users;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={users?.total ?? 0} icon={Users} color="text-primary" />
        <StatCard label="Active Users" value={users?.active ?? 0} icon={UserCheck} color="text-success" />
        <StatCard label="Inactive Users" value={users?.inactive ?? 0} icon={UserX} color="text-warning" />
        <StatCard label="Banned Users" value={users?.banned ?? 0} icon={Ban} color="text-danger" />
      </div>
    </div>
  );
}

function SuperAdminDashboard() {
  const { data, isLoading } = useSuperAdminDashboard();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const { users, admins, rooms, matches, sportTypes } = data || {};

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Users</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={users?.total ?? 0} icon={Users} color="text-primary" />
          <StatCard label="Active Users" value={users?.active ?? 0} icon={UserCheck} color="text-success" />
          <StatCard label="Inactive Users" value={users?.inactive ?? 0} icon={UserX} color="text-warning" />
          <StatCard label="Banned Users" value={users?.banned ?? 0} icon={Ban} color="text-danger" />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Platform</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Admins" value={admins?.total ?? 0} icon={ShieldCheck} color="text-info" />
          <StatCard label="Total Matches" value={matches?.total ?? 0} icon={Swords} color="text-primary" />
          <StatCard label="Total Rooms" value={rooms?.total ?? 0} icon={DoorOpen} color="text-success" />
          <StatCard label="Sport Types" value={sportTypes ?? 0} icon={Gamepad2} color="text-warning" />
        </div>
      </div>
    </div>
  );
}
