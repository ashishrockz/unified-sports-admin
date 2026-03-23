import { useState } from 'react';
import { useTrends, useEngagement, usePlatformSummary, useGrowth, useMatchAnalytics } from '../../hooks/use-analytics';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Select from '../../components/ui/Select';
import Skeleton from '../../components/ui/Skeleton';
import { Users, Swords, DoorOpen, Gamepad2, TrendingUp, TrendingDown, CheckCircle, XCircle, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const chartGrid = { strokeDasharray: '3 3', stroke: '#f1f5f9', vertical: false as const };
const axisTick = { fontSize: 12, fill: '#a1a1aa' };
const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'white',
    border: '1px solid #e4e4e7',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
    fontSize: '13px',
    padding: '10px 14px',
  },
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data: summary, isLoading: summaryLoading } = usePlatformSummary();
  const { data: trends, isLoading: trendsLoading } = useTrends(days);
  const { data: engagement } = useEngagement(days);
  const { data: growth } = useGrowth(days);
  const { data: matchAnalytics } = useMatchAnalytics(days);

  if (summaryLoading) return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between animate-slide-up">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Analytics</h2>
          <p className="mt-1 text-[13px] text-zinc-500">Platform performance and insights</p>
        </div>
        <Select
          value={String(days)}
          onChange={(e) => setDays(Number(e.target.value))}
          options={[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 90 days' },
          ]}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-stagger-1"><StatCard label="Total Users" value={summary?.totalUsers ?? 0} icon={Users} color="text-primary" iconBg="bg-indigo-50 dark:bg-indigo-500/10" /></div>
        <div className="animate-stagger-2"><StatCard label="Total Matches" value={summary?.totalMatches ?? 0} icon={Swords} color="text-success" iconBg="bg-emerald-50 dark:bg-emerald-500/10" /></div>
        <div className="animate-stagger-3"><StatCard label="Total Rooms" value={summary?.totalRooms ?? 0} icon={DoorOpen} color="text-info" iconBg="bg-blue-50 dark:bg-blue-500/10" /></div>
        <div className="animate-stagger-4"><StatCard label="Sport Types" value={summary?.totalSportTypes ?? 0} icon={Gamepad2} color="text-warning" iconBg="bg-amber-50 dark:bg-amber-500/10" /></div>
      </div>

      {growth && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 animate-stagger-3">
          <Card title="User Growth">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${growth.userGrowth?.rate >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                {growth.userGrowth?.rate >= 0 ? <TrendingUp className="h-5 w-5 text-emerald-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{growth.userGrowth?.rate?.toFixed(1)}%</span>
                <p className="text-[12px] text-zinc-500">{growth.userGrowth?.current} current vs {growth.userGrowth?.previous} previous</p>
              </div>
            </div>
          </Card>
          <Card title="Match Growth">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${growth.matchGrowth?.rate >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                {growth.matchGrowth?.rate >= 0 ? <TrendingUp className="h-5 w-5 text-emerald-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{growth.matchGrowth?.rate?.toFixed(1)}%</span>
                <p className="text-[12px] text-zinc-500">{growth.matchGrowth?.current} current vs {growth.matchGrowth?.previous} previous</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {engagement && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3 animate-stagger-4">
          <Card>
            <p className="text-[12px] font-medium text-zinc-400">Active Users</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{engagement.activeUsers ?? 0}</p>
          </Card>
          <Card>
            <p className="text-[12px] font-medium text-zinc-400">Matches per User</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{engagement.matchesPerUser?.toFixed(1) ?? 0}</p>
          </Card>
          <Card>
            <p className="text-[12px] font-medium text-zinc-400">Avg Session Duration</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{engagement.avgSessionDuration ? `${Math.round(engagement.avgSessionDuration / 60)}m` : '-'}</p>
          </Card>
        </div>
      )}

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="User Trends">
          {trendsLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trends?.users ?? []}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#userGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card title="Match Trends">
          {trendsLoading ? (
            <Skeleton className="h-64 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trends?.matches ?? []}>
                <defs>
                  <linearGradient id="matchGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fill="url(#matchGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {trends?.sportPopularity && trends.sportPopularity.length > 0 && (
        <div className="mb-6">
          <Card title="Sport Popularity">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trends.sportPopularity} barCategoryGap="25%">
                <CartesianGrid {...chartGrid} />
                <XAxis dataKey="sport" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="url(#sportGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="sportGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {matchAnalytics && (
        <>
          <div className="mt-6 mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Completion Rate" value={`${matchAnalytics.completionRate}%`} icon={CheckCircle} color="text-success" iconBg="bg-emerald-50 dark:bg-emerald-500/10" />
            <StatCard label="Abandon Rate" value={`${matchAnalytics.abandonRate}%`} icon={XCircle} color="text-danger" iconBg="bg-red-50 dark:bg-red-500/10" />
            <StatCard label="Total Matches" value={matchAnalytics.total ?? 0} icon={Swords} color="text-primary" iconBg="bg-indigo-50 dark:bg-indigo-500/10" />
          </div>

          {matchAnalytics.avgDurationBySport?.length > 0 && (
            <div className="mb-6">
              <Card title="Average Match Duration by Sport">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={matchAnalytics.avgDurationBySport} barCategoryGap="25%">
                    <CartesianGrid {...chartGrid} />
                    <XAxis dataKey="sport" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTick} axisLine={false} tickLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#a1a1aa', fontSize: 12 }} />
                    <Tooltip {...tooltipStyle} formatter={(value: number) => [`${value} min`, 'Avg Duration']} />
                    <Bar dataKey="avgDurationMinutes" fill="url(#durationGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {matchAnalytics.peakHours?.length > 0 && (
            <Card title="Peak Usage Hours">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={matchAnalytics.peakHours} barCategoryGap="15%">
                  <CartesianGrid {...chartGrid} />
                  <XAxis dataKey="hour" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(h: number) => `${h}:00`} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} labelFormatter={(h: number) => `${h}:00 - ${h + 1}:00`} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                  <Bar dataKey="count" fill="url(#hourGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
