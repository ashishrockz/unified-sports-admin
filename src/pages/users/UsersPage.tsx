import { useState } from 'react';
import {
  useUsers, useBanUser, useUnbanUser, useActivateUser, useDeactivateUser,
  useBulkAction, useExportUsers, useUserDetail,
} from '../../hooks/use-users';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import Can from '../../components/guards/Can';
import { formatDate, formatDateTime, formatRelative } from '../../lib/utils';
import { Eye, Download, Users as UsersIcon, Mail, Phone, Calendar, Shield } from 'lucide-react';
import type { User, BulkAction } from '../../types/user';
import { toast } from 'sonner';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useUsers({ page, limit: 20, search, status: status || undefined });

  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const bulkAction = useBulkAction();

  const [confirm, setConfirm] = useState<{ action: string; userId: string; name: string } | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkConfirm, setBulkConfirm] = useState<BulkAction | null>(null);

  const users: User[] = data?.users ?? [];
  const pagination = data?.pagination;

  const handleAction = () => {
    if (!confirm) return;
    const mutate = { ban: banUser, unban: unbanUser, activate: activateUser, deactivate: deactivateUser }[confirm.action];
    mutate?.mutate(confirm.userId, { onSuccess: () => setConfirm(null) });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(users.map((u) => u._id)));
    }
  };

  const handleBulkAction = () => {
    if (!bulkConfirm || selected.size === 0) return;
    bulkAction.mutate(
      { userIds: Array.from(selected), action: bulkConfirm },
      { onSuccess: () => { setBulkConfirm(null); setSelected(new Set()); } }
    );
  };

  const exportCsv = useExportUsers({ format: 'csv', status: status || undefined });
  const exportJson = useExportUsers({ format: 'json', status: status || undefined });

  const handleExport = (format: 'csv' | 'json') => {
    const fn = format === 'csv' ? exportCsv : exportJson;
    fn().then(() => toast.success(`Users exported as ${format.toUpperCase()}`)).catch(() => {});
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between animate-slide-up">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Users</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{pagination?.total ?? 0} total users</p>
        </div>
        <Can permission="users.read">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleExport('csv')}>
              <Download className="mr-1.5 h-3.5 w-3.5" />CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport('json')}>
              <Download className="mr-1.5 h-3.5 w-3.5" />JSON
            </Button>
          </div>
        </Can>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search users..." className="sm:w-64" />
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'banned', label: 'Banned' },
          ]}
        />

        {/* Bulk Actions */}
        <Can permission="users.update">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-zinc-500">{selected.size} selected</span>
              <Button size="sm" variant="primary" onClick={() => setBulkConfirm('activate')}>Activate</Button>
              <Button size="sm" variant="outline" onClick={() => setBulkConfirm('deactivate')}>Deactivate</Button>
              <Can permission="users.delete">
                <Button size="sm" variant="danger" onClick={() => setBulkConfirm('ban')}>Ban</Button>
              </Can>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
            </div>
          )}
        </Can>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : users.length === 0 ? (
        <EmptyState message="No users found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 animate-stagger-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <Can permission="users.update">
                  <th className="w-10 px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={users.length > 0 && selected.size === users.length}
                      onChange={toggleAll}
                      className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-600"
                    />
                  </th>
                </Can>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">User</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Contact</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Joined</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={`border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 transition-colors ${selected.has(user._id) ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'}`}>
                  <Can permission="users.update">
                    <td className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(user._id)}
                        onChange={() => toggleSelect(user._id)}
                        className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-600"
                      />
                    </td>
                  </Can>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} className="h-8 w-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</span>
                        {user.username && <p className="text-xs text-zinc-400">@{user.username}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-500 dark:text-zinc-400">{user.email || '-'}</div>
                    {user.phone && <div className="text-xs text-zinc-400">{user.phone}</div>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-500 dark:text-zinc-400">{formatDate(user.createdAt)}</div>
                    <div className="text-xs text-zinc-400">{formatRelative(user.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setDetailId(user._id)} title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Can permission="users.update">
                        {user.status === 'active' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setConfirm({ action: 'deactivate', userId: user._id, name: user.name })}>Deactivate</Button>
                            <Can permission="users.delete">
                              <Button size="sm" variant="danger" onClick={() => setConfirm({ action: 'ban', userId: user._id, name: user.name })}>Ban</Button>
                            </Can>
                          </>
                        )}
                        {user.status === 'inactive' && (
                          <Button size="sm" variant="primary" onClick={() => setConfirm({ action: 'activate', userId: user._id, name: user.name })}>Activate</Button>
                        )}
                        {user.status === 'banned' && (
                          <Button size="sm" variant="outline" onClick={() => setConfirm({ action: 'unban', userId: user._id, name: user.name })}>Unban</Button>
                        )}
                      </Can>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination && (
            <div className="px-4">
              <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {/* User Detail Modal */}
      {detailId && <UserDetailModal userId={detailId} onClose={() => setDetailId(null)} />}

      {/* Single Action Confirm */}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleAction}
        title={`${confirm?.action?.charAt(0).toUpperCase()}${confirm?.action?.slice(1)} User`}
        description={`Are you sure you want to ${confirm?.action} "${confirm?.name}"?`}
        loading={banUser.isPending || unbanUser.isPending || activateUser.isPending || deactivateUser.isPending}
        variant={confirm?.action === 'ban' ? 'danger' : 'primary'}
      />

      {/* Bulk Action Confirm */}
      <ConfirmDialog
        open={!!bulkConfirm}
        onClose={() => setBulkConfirm(null)}
        onConfirm={handleBulkAction}
        title={`Bulk ${bulkConfirm?.charAt(0).toUpperCase()}${bulkConfirm?.slice(1)}`}
        description={`Are you sure you want to ${bulkConfirm} ${selected.size} user(s)?`}
        loading={bulkAction.isPending}
        variant={bulkConfirm === 'ban' ? 'danger' : 'primary'}
      />
    </div>
  );
}

function UserDetailModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { data: user, isLoading } = useUserDetail(userId);

  return (
    <Modal open onClose={onClose} title="User Details" className="max-w-lg">
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : !user ? (
        <p className="text-sm text-zinc-500">User not found</p>
      ) : (
        <div className="space-y-5">
          {/* Profile Header */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
            {user.avatar ? (
              <img src={user.avatar} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white dark:ring-zinc-800" alt="" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-violet-100 text-lg font-semibold text-primary dark:from-primary/20 dark:to-violet-500/10 dark:text-indigo-400">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
              {user.username && <p className="text-sm text-zinc-500">@{user.username}</p>}
            </div>
            <StatusBadge status={user.status} />
          </div>

          {/* Details */}
          <div className="space-y-3">
            {user.email && (
              <DetailRow icon={Mail} label="Email" value={user.email} />
            )}
            {user.phone && (
              <DetailRow icon={Phone} label="Phone" value={user.phone} />
            )}
            <DetailRow icon={Shield} label="Role" value={user.role} />
            <DetailRow icon={Calendar} label="Joined" value={formatDateTime(user.createdAt)} />
            <DetailRow icon={UsersIcon} label="Friends" value={String(user.friendsCount ?? 0)} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <span className="text-xs text-zinc-400">ID: {user._id}</span>
            <span className="text-xs text-zinc-400">Updated {formatRelative(user.updatedAt)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200/60 p-3.5 dark:border-zinc-800/60">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon className="h-4 w-4 text-zinc-400" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">{value}</p>
      </div>
    </div>
  );
}
