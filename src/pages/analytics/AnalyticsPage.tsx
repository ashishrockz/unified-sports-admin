import { useState } from 'react';
import { useTrends, useEngagement, usePlatformSummary, useGrowth } from '../../hooks/use-analytics';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import { Users, Swords, DoorOpen, Gamepad2, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const { data: summary, isLoading: summaryLoading } = usePlatformSummary();
  const { data: trends, isLoading: trendsLoading } = useTrends(days);
  const { data: engagement } = useEngagement(days);
  const { data: growth } = useGrowth(days);

  if (summaryLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h2>
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
        <StatCard label="Total Users" value={summary?.totalUsers ?? 0} icon={Users} color="text-primary" />
        <StatCard label="Total Matches" value={summary?.totalMatches ?? 0} icon={Swords} color="text-success" />
        <StatCard label="Total Rooms" value={summary?.totalRooms ?? 0} icon={DoorOpen} color="text-info" />
        <StatCard label="Sport Types" value={summary?.totalSportTypes ?? 0} icon={Gamepad2} color="text-warning" />
      </div>

      {growth && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Card title="User Growth">
            <div className="flex items-center gap-3">
              {growth.userGrowth?.rate >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{growth.userGrowth?.rate?.toFixed(1)}%</span>
              <span className="text-sm text-gray-500">{growth.userGrowth?.current} current vs {growth.userGrowth?.previous} previous</span>
            </div>
          </Card>
          <Card title="Match Growth">
            <div className="flex items-center gap-3">
              {growth.matchGrowth?.rate >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{growth.matchGrowth?.rate?.toFixed(1)}%</span>
              <span className="text-sm text-gray-500">{growth.matchGrowth?.current} current vs {growth.matchGrowth?.previous} previous</span>
            </div>
          </Card>
        </div>
      )}

      {engagement && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card title="Active Users">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{engagement.activeUsers ?? 0}</p>
          </Card>
          <Card title="Matches per User">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{engagement.matchesPerUser?.toFixed(1) ?? 0}</p>
          </Card>
          <Card title="Avg Session Duration">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{engagement.avgSessionDuration ? `${Math.round(engagement.avgSessionDuration / 60)}m` : '-'}</p>
          </Card>
        </div>
      )}

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card title="User Trends">
          {trendsLoading ? (
            <div className="flex h-64 items-center justify-center"><Spinner /></div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends?.users ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card title="Match Trends">
          {trendsLoading ? (
            <div className="flex h-64 items-center justify-center"><Spinner /></div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends?.matches ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {trends?.sportPopularity && trends.sportPopularity.length > 0 && (
        <Card title="Sport Popularity">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trends.sportPopularity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sport" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
