import { useState } from 'react';
import { useNotifications, useNotificationStats, useDeleteNotification } from '../../hooks/use-notifications';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatCard from '../../components/ui/StatCard';
import { formatDateTime } from '../../lib/utils';
import { Bell, Trash2, Swords, UserPlus, Users, CheckCircle, XCircle, Mail } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'match_completed', label: 'Match Completed' },
  { value: 'added_to_match', label: 'Added to Match' },
  { value: 'friend_request_received', label: 'Friend Request' },
  { value: 'friend_request_accepted', label: 'Request Accepted' },
  { value: 'friend_request_rejected', label: 'Request Rejected' },
];

const READ_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Read' },
  { value: 'false', label: 'Unread' },
];

const TYPE_ICON: Record<string, typeof Bell> = {
  match_completed: Swords,
  added_to_match: UserPlus,
  friend_request_received: Users,
  friend_request_accepted: CheckCircle,
  friend_request_rejected: XCircle,
};

const TYPE_VARIANT: Record<string, string> = {
  match_completed: 'success',
  added_to_match: 'primary',
  friend_request_received: 'info',
  friend_request_accepted: 'success',
  friend_request_rejected: 'danger',
};

const TYPE_LABEL: Record<string, string> = {
  match_completed: 'Match Completed',
  added_to_match: 'Added to Match',
  friend_request_received: 'Friend Request',
  friend_request_accepted: 'Request Accepted',
  friend_request_rejected: 'Request Rejected',
};

interface Notification {
  _id: string;
  recipient: { _id: string; name: string; username: string; avatar?: string } | null;
  actor: { _id: string; name: string; username: string; avatar?: string } | null;
  type: string;
  title: string;
  body: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [read, setRead] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useNotifications({ page, limit: 20, type: type || undefined, read: read || undefined });
  const { data: stats } = useNotificationStats();
  const deleteNotification = useDeleteNotification();

  const notifications: Notification[] = data?.notifications ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-6 animate-slide-up">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Notifications</h2>
        <p className="mt-1 text-[13px] text-zinc-500">Monitor all user notifications across the platform</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 animate-stagger-1">
          <StatCard label="Total" value={stats.total} icon={Bell} />
          <StatCard label="Unread" value={stats.unread} icon={Mail} color="text-amber-500" iconBg="bg-amber-50 dark:bg-amber-500/10" />
          <StatCard label="Match Events" value={(stats.byType?.match_completed || 0) + (stats.byType?.added_to_match || 0)} icon={Swords} color="text-blue-500" iconBg="bg-blue-50 dark:bg-blue-500/10" />
          <StatCard label="Friend Events" value={(stats.byType?.friend_request_received || 0) + (stats.byType?.friend_request_accepted || 0) + (stats.byType?.friend_request_rejected || 0)} icon={Users} color="text-emerald-500" iconBg="bg-emerald-50 dark:bg-emerald-500/10" />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row animate-stagger-1">
        <Select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          options={TYPE_OPTIONS}
        />
        <Select
          value={read}
          onChange={(e) => { setRead(e.target.value); setPage(1); }}
          options={READ_OPTIONS}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} message="No notifications found" description="Notifications will appear here as users interact with the platform" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 animate-stagger-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Type</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Recipient</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Message</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                return (
                  <tr key={n._id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-zinc-400" />
                        <Badge variant={TYPE_VARIANT[n.type] || 'neutral'} dot>
                          {TYPE_LABEL[n.type] || n.type}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          {n.recipient?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">{n.recipient?.name || 'Unknown'}</div>
                          {n.recipient?.username && (
                            <div className="text-[11px] text-zinc-400">@{n.recipient.username}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{n.title}</div>
                        <div className="text-[12px] text-zinc-500 truncate">{n.body}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={n.read ? 'neutral' : 'warning'} dot>
                        {n.read ? 'Read' : 'Unread'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {formatDateTime(n.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteId(n._id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pagination && (
            <div className="px-4">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        variant="danger"
        loading={deleteNotification.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteNotification.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
          }
        }}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
