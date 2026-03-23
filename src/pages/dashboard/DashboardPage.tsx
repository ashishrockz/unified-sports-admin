import { useAuthStore } from '../../stores/auth.store';
import { useAdminDashboard, useSuperAdminDashboard } from '../../hooks/use-dashboard';
import { useGrowth, useMatchAnalytics } from '../../hooks/use-analytics';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';
import Can from '../../components/guards/Can';
import { ROLE_LABELS } from '../../config/permissions';
import {
  Users, UserCheck, UserX, Ban, ShieldCheck, Swords, DoorOpen,
  Gamepad2, CheckCircle, XCircle, Activity, Clock, BarChart3,
  Zap, ArrowRight, TrendingUp, Calendar,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <div>
      {/* Welcome Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-primary to-violet-600 p-6 text-white shadow-xl shadow-primary/20 lg:p-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-dot-grid opacity-50" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-400/20 blur-2xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
                <Calendar className="h-3 w-3" />
                {today}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight lg:text-3xl">
              {greeting()}, {user?.name?.split(' ')[0]}
            </h2>
            <p className="mt-1.5 text-sm text-indigo-200">
              {role ? ROLE_LABELS[role] : 'Unknown'} Dashboard — Here's what's happening today
            </p>
          </div>
          <div className="hidden lg:flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Zap className="h-7 w-7" />
          </div>
        </div>
      </div>

      {role === 'super_admin' ? (
        <SuperAdminDashboard />
      ) : role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <LimitedDashboard />
      )}
    </div>
  );
}

const PIE_COLORS = ['#10b981', '#6366f1', '#ef4444', '#a78bfa'];

const tooltipStyle = {
  backgroundColor: 'white',
  border: '1px solid #e4e4e7',
  borderRadius: '12px',
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
  fontSize: '13px',
  padding: '10px 14px',
};

function MatchStatusPie({ matches }: { matches: { completed: number; active: number; abandoned: number } }) {
  const data = [
    { name: 'Completed', value: matches.completed, color: PIE_COLORS[0] },
    { name: 'Active', value: matches.active, color: PIE_COLORS[1] },
    { name: 'Abandoned', value: matches.abandoned, color: PIE_COLORS[2] },
  ].filter((d) => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);
  if (data.length === 0) return <p className="py-8 text-center text-sm text-zinc-400">No match data yet</p>;

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width="55%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} strokeWidth={3} stroke="#fff" paddingAngle={2}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[13px] text-zinc-600 dark:text-zinc-400">{d.name}</span>
            <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{d.value}</span>
            <span className="text-[11px] text-zinc-400">({total ? Math.round((d.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500">{children}</h3>
      {action}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

function RecentTable({ title, rows, columns, viewAllPath }: {
  title: string;
  rows: Record<string, unknown>[];
  columns: { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode }[];
  viewAllPath?: string;
}) {
  const navigate = useNavigate();
  return (
    <Card
      title={title}
      action={viewAllPath ? (
        <button onClick={() => navigate(viewAllPath)} className="group flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary-hover transition-colors">
          View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : undefined}
    >
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400">No data yet</p>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                {columns.map((col) => (
                  <th key={col.key} className="pb-3 pr-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-50 last:border-0 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800/30 dark:hover:bg-zinc-800/20">
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
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

function LimitedDashboard() {
  const { data, isLoading } = useAdminDashboard();
  if (isLoading) return <DashboardSkeleton />;
  const matches = data?.matches;

  return (
    <>
      {matches && (
        <div className="mb-8">
          <SectionTitle>Overview</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="animate-stagger-1"><StatCard label="Total Matches" value={matches.total ?? 0} icon={Swords} color="text-primary" /></div>
            <div className="animate-stagger-2"><StatCard label="Completed" value={matches.completed ?? 0} icon={CheckCircle} color="text-success" /></div>
            <div className="animate-stagger-3"><StatCard label="Active" value={matches.active ?? 0} icon={Activity} color="text-info" /></div>
          </div>
        </div>
      )}
      {matches && (
        <div className="mb-8 grid gap-4 lg:grid-cols-2 animate-stagger-4">
          <Card title="Match Status Breakdown">
            <MatchStatusPie matches={matches} />
          </Card>
        </div>
      )}
      <Can permission="reports.read">
        {data?.recentMatches && (
          <div className="animate-stagger-5">
            <RecentTable title="Recent Matches" rows={data.recentMatches} viewAllPath="/matches" columns={[
              { key: 'sport', label: 'Sport', render: (v) => <Badge variant="primary">{String(v ?? '-')}</Badge> },
              { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v ?? '')} /> },
              { key: 'createdAt', label: 'Created', render: (v) => v ? format(new Date(String(v)), 'MMM d, HH:mm') : '-' },
            ]} />
          </div>
        )}
      </Can>
    </>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();
  if (isLoading) return <DashboardSkeleton />;
  const users = data?.users;
  const matches = data?.matches;

  return (
    <>
      <div className="mb-8">
        <SectionTitle>Users</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-stagger-1"><StatCard label="Total Users" value={users?.total ?? 0} icon={Users} color="text-primary" /></div>
          <div className="animate-stagger-2"><StatCard label="Active Users" value={users?.active ?? 0} icon={UserCheck} color="text-success" /></div>
          <div className="animate-stagger-3"><StatCard label="Inactive Users" value={users?.inactive ?? 0} icon={UserX} color="text-warning" /></div>
          <div className="animate-stagger-4"><StatCard label="Banned Users" value={users?.banned ?? 0} icon={Ban} color="text-danger" /></div>
        </div>
      </div>
      {matches && (
        <div className="mb-8">
          <SectionTitle>Matches</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Matches" value={matches.total ?? 0} icon={Swords} color="text-primary" />
            <StatCard label="Completed" value={matches.completed ?? 0} icon={CheckCircle} color="text-success" />
            <StatCard label="Active" value={matches.active ?? 0} icon={Activity} color="text-info" />
            <StatCard label="Abandoned" value={matches.abandoned ?? 0} icon={XCircle} color="text-danger" />
          </div>
        </div>
      )}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {matches && <Card title="Match Status"><MatchStatusPie matches={matches} /></Card>}
        {data?.recentUsers && (
          <RecentTable title="Recent Signups" rows={data.recentUsers} viewAllPath="/users" columns={[
            { key: 'name', label: 'Name' },
            { key: 'username', label: 'Username' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v ?? '')} /> },
            { key: 'createdAt', label: 'Joined', render: (v) => v ? format(new Date(String(v)), 'MMM d, yyyy') : '-' },
          ]} />
        )}
      </div>
      {data?.recentMatches && (
        <RecentTable title="Recent Matches" rows={data.recentMatches} viewAllPath="/matches" columns={[
          { key: 'sport', label: 'Sport', render: (v) => <Badge variant="primary">{String(v ?? '-')}</Badge> },
          { key: 'roomId', label: 'Room', render: (_, row) => { const r = row.roomId as Record<string, unknown> | null; return r && typeof r === 'object' ? String(r.name ?? '-') : '-'; }},
          { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v ?? '')} /> },
          { key: 'createdAt', label: 'Created', render: (v) => v ? format(new Date(String(v)), 'MMM d, HH:mm') : '-' },
        ]} />
      )}
    </>
  );
}

function SuperAdminDashboard() {
  const { data, isLoading } = useSuperAdminDashboard();
  const { data: adminData } = useAdminDashboard();
  const { data: growth } = useGrowth(30);
  const { data: matchAnalytics } = useMatchAnalytics(30);

  if (isLoading) return <DashboardSkeleton />;

  const { users, admins, rooms, matches, sportTypes } = data || {};
  const adminDashMatches = adminData?.matches;

  return (
    <>
      {/* Users */}
      <div className="mb-8">
        <SectionTitle>Users</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-stagger-1"><StatCard label="Total Users" value={users?.total ?? 0} icon={Users} color="text-primary" iconBg="bg-indigo-50 dark:bg-indigo-500/10" change={growth?.userGrowthRate != null ? Math.round(growth.userGrowthRate) : undefined} /></div>
          <div className="animate-stagger-2"><StatCard label="Active Users" value={users?.active ?? 0} icon={UserCheck} color="text-success" iconBg="bg-emerald-50 dark:bg-emerald-500/10" /></div>
          <div className="animate-stagger-3"><StatCard label="Inactive Users" value={users?.inactive ?? 0} icon={UserX} color="text-warning" iconBg="bg-amber-50 dark:bg-amber-500/10" /></div>
          <div className="animate-stagger-4"><StatCard label="Banned Users" value={users?.banned ?? 0} icon={Ban} color="text-danger" iconBg="bg-red-50 dark:bg-red-500/10" /></div>
        </div>
      </div>

      {/* Platform */}
      <div className="mb-8">
        <SectionTitle>Platform</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="animate-stagger-1"><StatCard label="Total Admins" value={admins?.total ?? 0} icon={ShieldCheck} color="text-info" iconBg="bg-blue-50 dark:bg-blue-500/10" /></div>
          <div className="animate-stagger-2"><StatCard label="Total Matches" value={matches?.total ?? 0} icon={Swords} color="text-primary" iconBg="bg-indigo-50 dark:bg-indigo-500/10" change={growth?.matchGrowthRate != null ? Math.round(growth.matchGrowthRate) : undefined} /></div>
          <div className="animate-stagger-3"><StatCard label="Total Rooms" value={rooms?.total ?? 0} icon={DoorOpen} color="text-success" iconBg="bg-emerald-50 dark:bg-emerald-500/10" /></div>
          <div className="animate-stagger-4"><StatCard label="Sport Types" value={sportTypes ?? 0} icon={Gamepad2} color="text-warning" iconBg="bg-amber-50 dark:bg-amber-500/10" /></div>
        </div>
      </div>

      {/* Match Analytics */}
      {matchAnalytics && (
        <div className="mb-8">
          <SectionTitle>
            Match Analytics (30 Days)
          </SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Completion Rate" value={`${Math.round(matchAnalytics.completionRate ?? 0)}%`} icon={CheckCircle} color="text-success" iconBg="bg-emerald-50 dark:bg-emerald-500/10" />
            <StatCard label="Abandon Rate" value={`${Math.round(matchAnalytics.abandonRate ?? 0)}%`} icon={XCircle} color="text-danger" iconBg="bg-red-50 dark:bg-red-500/10" />
            <StatCard label="Avg Duration" value={matchAnalytics.avgDurationMinutes != null ? `${Math.round(matchAnalytics.avgDurationMinutes)}m` : '-'} icon={Clock} color="text-info" iconBg="bg-blue-50 dark:bg-blue-500/10" />
            <StatCard label="Active Now" value={adminDashMatches?.active ?? 0} icon={Activity} color="text-primary" iconBg="bg-indigo-50 dark:bg-indigo-500/10" />
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {adminDashMatches && (
          <Card title="Match Status Breakdown">
            <MatchStatusPie matches={adminDashMatches} />
          </Card>
        )}
        {matchAnalytics?.peakHours && matchAnalytics.peakHours.length > 0 && (
          <Card title="Peak Usage Hours">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={matchAnalytics.peakHours.slice(0, 12)} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(h: number) => `${h}:00`} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={(h: number) => `${h}:00`} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Sport Duration */}
      {matchAnalytics?.avgDurationBySport && matchAnalytics.avgDurationBySport.length > 0 && (
        <div className="mb-8">
          <Card title="Average Duration by Sport">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {matchAnalytics.avgDurationBySport.map((s: any) => (
                <div key={s._id || s.sport} className="group flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all duration-200 hover:border-zinc-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light transition-transform duration-200 group-hover:scale-110 dark:bg-primary/10">
                      <BarChart3 className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold capitalize text-zinc-700 dark:text-zinc-300">{s._id || s.sport}</span>
                  </div>
                  <Badge variant="info">{Math.round(s.avgDuration ?? 0)}m</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Tables */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        {adminData?.recentUsers && (
          <RecentTable title="Recent Signups" rows={adminData.recentUsers} viewAllPath="/users" columns={[
            { key: 'name', label: 'Name' },
            { key: 'username', label: 'Username' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v ?? '')} /> },
            { key: 'createdAt', label: 'Joined', render: (v) => v ? format(new Date(String(v)), 'MMM d, yyyy') : '-' },
          ]} />
        )}
        {adminData?.recentRooms && (
          <RecentTable title="Recent Rooms" rows={adminData.recentRooms} viewAllPath="/rooms" columns={[
            { key: 'name', label: 'Room' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v ?? '')} /> },
            { key: 'createdAt', label: 'Created', render: (v) => v ? format(new Date(String(v)), 'MMM d, HH:mm') : '-' },
          ]} />
        )}
      </div>

      {adminData?.recentMatches && (
        <RecentTable title="Recent Matches" rows={adminData.recentMatches} viewAllPath="/matches" columns={[
          { key: 'sport', label: 'Sport', render: (v) => <Badge variant="primary">{String(v ?? '-')}</Badge> },
          { key: 'roomId', label: 'Room', render: (_, row) => { const r = row.roomId as Record<string, unknown> | null; return r && typeof r === 'object' ? String(r.name ?? '-') : '-'; }},
          { key: 'status', label: 'Status', render: (v) => <StatusBadge status={String(v ?? '')} /> },
          { key: 'createdAt', label: 'Created', render: (v) => v ? format(new Date(String(v)), 'MMM d, HH:mm') : '-' },
        ]} />
      )}
    </>
  );
}
