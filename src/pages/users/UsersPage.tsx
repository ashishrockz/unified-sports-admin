import { useState } from 'react';
import { useUsers, useBanUser, useUnbanUser, useActivateUser, useDeactivateUser } from '../../hooks/use-users';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import type { User } from '../../types/user';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useUsers({ page, limit: 20, search, status: status || undefined });

  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();

  const [confirm, setConfirm] = useState<{ action: string; userId: string; name: string } | null>(null);

  const handleAction = () => {
    if (!confirm) return;
    const mutate = { ban: banUser, unban: unbanUser, activate: activateUser, deactivate: deactivateUser }[confirm.action];
    mutate?.mutate(confirm.userId, { onSuccess: () => setConfirm(null) });
  };

  const users: User[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h2>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
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
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : users.length === 0 ? (
        <EmptyState message="No users found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Email / Phone</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} className="h-8 w-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold dark:bg-gray-700">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email || user.phone || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {user.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setConfirm({ action: 'deactivate', userId: user._id, name: user.name })}>Deactivate</Button>
                          <Button size="sm" variant="danger" onClick={() => setConfirm({ action: 'ban', userId: user._id, name: user.name })}>Ban</Button>
                        </>
                      )}
                      {user.status === 'inactive' && (
                        <Button size="sm" variant="primary" onClick={() => setConfirm({ action: 'activate', userId: user._id, name: user.name })}>Activate</Button>
                      )}
                      {user.status === 'banned' && (
                        <Button size="sm" variant="outline" onClick={() => setConfirm({ action: 'unban', userId: user._id, name: user.name })}>Unban</Button>
                      )}
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

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleAction}
        title={`${confirm?.action?.charAt(0).toUpperCase()}${confirm?.action?.slice(1)} User`}
        description={`Are you sure you want to ${confirm?.action} "${confirm?.name}"?`}
        loading={banUser.isPending || unbanUser.isPending || activateUser.isPending || deactivateUser.isPending}
        variant={confirm?.action === 'ban' ? 'danger' : 'primary'}
      />
    </div>
  );
}
