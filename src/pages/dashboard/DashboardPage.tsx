import { useAuthStore } from '../../stores/auth.store';
import { useAdminDashboard, useSuperAdminDashboard } from '../../hooks/use-dashboard';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Users, UserCheck, UserX, Ban, ShieldCheck, Swords, DoorOpen, Gamepad2, CheckCircle, XCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';

export default function DashboardPage() {
  const isSuperAdmin = useAuthStore((s) => s.user?.role === 'superadmin');

  return isSuperAdmin ? <SuperAdminDashboard /> : <AdminDashboard />;
}

const PIE_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#a855f7'];

function MatchStatusPie({ matches }: { matches: { completed: number; active: number; abandoned: number } }) {
  const data = [
    { name: 'Completed', value: matches.completed },
    { name: 'Active', value: matches.active },
    { name: 'Abandoned', value: matches.abandoned },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return <p className="text-sm text-gray-400">No match data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function RecentTable({ title, rows, columns }: { title: string; rows: Record<string, unknown>[]; columns: { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode }[] }) {
  return (
    <Card title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {columns.map((col) => (
                  <th key={col.key} className="pb-2 pr-4 font-medium text-gray-500">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  {columns.map((col) => (
                    <td key={col.key} className="py-2 pr-4 text-gray-700 dark:text-gray-300">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const users = data?.users;
  const matches = data?.matches;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>

      {/* User stats */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Users</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={users?.total ?? 0} icon={Users} color="text-primary" />
          <StatCard label="Active Users" value={users?.active ?? 0} icon={UserCheck} color="text-success" />
          <StatCard label="Inactive Users" value={users?.inactive ?? 0} icon={UserX} color="text-warning" />
          <StatCard label="Banned Users" value={users?.banned ?? 0} icon={Ban} color="text-danger" />
        </div>
      </div>

      {/* Match stats */}
      {matches && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">Matches</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Matches" value={matches.total ?? 0} icon={Swords} color="text-primary" />
            <StatCard label="Completed" value={matches.completed ?? 0} icon={CheckCircle} color="text-success" />
            <StatCard label="Active" value={matches.active ?? 0} icon={Activity} color="text-info" />
            <StatCard label="Abandoned" value={matches.abandoned ?? 0} icon={XCircle} color="text-danger" />
          </div>
        </div>
      )}

      {/* Match breakdown + Recent signups */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {matches && (
          <Card title="Match Status Breakdown">
            <MatchStatusPie matches={matches} />
          </Card>
        )}

        {data?.recentUsers && (
          <RecentTable
            title="Recent Signups"
            rows={data.recentUsers}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'username', label: 'Username' },
              { key: 'status', label: 'Status', render: (v) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v === 'active' ? 'bg-green-100 text-green-700' : v === 'banned' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{String(v)}</span>
              )},
              { key: 'createdAt', label: 'Joined', render: (v) => v ? format(new Date(String(v)), 'MMM d, yyyy') : '-' },
            ]}
          />
        )}
      </div>

      {/* Recent matches */}
      {data?.recentMatches && (
        <div className="mb-6">
          <RecentTable
            title="Recent Matches"
            rows={data.recentMatches}
            columns={[
              { key: 'sport', label: 'Sport', render: (v) => String(v ?? '-').charAt(0).toUpperCase() + String(v ?? '-').slice(1) },
              { key: 'roomId', label: 'Room', render: (_, row) => {
                const room = row.roomId as Record<string, unknown> | null;
                return room && typeof room === 'object' ? String(room.name ?? '-') : '-';
              }},
              { key: 'status', label: 'Status', render: (v) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v === 'completed' ? 'bg-green-100 text-green-700' : v === 'active' ? 'bg-blue-100 text-blue-700' : v === 'abandoned' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{String(v)}</span>
              )},
              { key: 'createdAt', label: 'Created', render: (v) => v ? format(new Date(String(v)), 'MMM d, HH:mm') : '-' },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function SuperAdminDashboard() {
  const { data, isLoading } = useSuperAdminDashboard();
  const { data: adminData } = useAdminDashboard();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const { users, admins, rooms, matches, sportTypes } = data || {};
  const adminDashMatches = adminData?.matches;

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

      {/* Match breakdown + Recent signups */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {adminDashMatches && (
          <Card title="Match Status Breakdown">
            <MatchStatusPie matches={adminDashMatches} />
          </Card>
        )}

        {adminData?.recentUsers && (
          <RecentTable
            title="Recent Signups"
            rows={adminData.recentUsers}
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'username', label: 'Username' },
              { key: 'status', label: 'Status', render: (v) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v === 'active' ? 'bg-green-100 text-green-700' : v === 'banned' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{String(v)}</span>
              )},
              { key: 'createdAt', label: 'Joined', render: (v) => v ? format(new Date(String(v)), 'MMM d, yyyy') : '-' },
            ]}
          />
        )}
      </div>

      {/* Recent matches */}
      {adminData?.recentMatches && (
        <div className="mb-6">
          <RecentTable
            title="Recent Matches"
            rows={adminData.recentMatches}
            columns={[
              { key: 'sport', label: 'Sport', render: (v) => String(v ?? '-').charAt(0).toUpperCase() + String(v ?? '-').slice(1) },
              { key: 'roomId', label: 'Room', render: (_, row) => {
                const room = row.roomId as Record<string, unknown> | null;
                return room && typeof room === 'object' ? String(room.name ?? '-') : '-';
              }},
              { key: 'status', label: 'Status', render: (v) => (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v === 'completed' ? 'bg-green-100 text-green-700' : v === 'active' ? 'bg-blue-100 text-blue-700' : v === 'abandoned' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{String(v)}</span>
              )},
              { key: 'createdAt', label: 'Created', render: (v) => v ? format(new Date(String(v)), 'MMM d, HH:mm') : '-' },
            ]}
          />
        </div>
      )}
    </div>
  );
}
