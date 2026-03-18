import { useState } from 'react';
import { useAdmins, useCreateAdmin, useActivateAdmin, useDeactivateAdmin, useRemoveAdmin } from '../../hooks/use-admins';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import type { Admin } from '../../types/admin';

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdmins({ page, limit: 20, search });

  const createAdmin = useCreateAdmin();
  const activateAdmin = useActivateAdmin();
  const deactivateAdmin = useDeactivateAdmin();
  const removeAdmin = useRemoveAdmin();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [confirm, setConfirm] = useState<{ action: string; id: string; name: string } | null>(null);

  const admins: Admin[] = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin.mutate(form, {
      onSuccess: () => { setShowCreate(false); setForm({ name: '', email: '', password: '' }); },
    });
  };

  const handleConfirm = () => {
    if (!confirm) return;
    const actions: Record<string, typeof activateAdmin> = { activate: activateAdmin, deactivate: deactivateAdmin, remove: removeAdmin };
    actions[confirm.action]?.mutate(confirm.id, { onSuccess: () => setConfirm(null) });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admins</h2>
        <Button onClick={() => setShowCreate(true)}>Add Admin</Button>
      </div>
      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search admins..." className="sm:w-64" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : admins.length === 0 ? (
        <EmptyState message="No admins found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{admin.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{admin.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">{admin.role}</td>
                  <td className="px-4 py-3"><StatusBadge status={admin.status} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(admin.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {admin.status === 'active' ? (
                        <Button size="sm" variant="outline" onClick={() => setConfirm({ action: 'deactivate', id: admin._id, name: admin.name })}>Deactivate</Button>
                      ) : (
                        <Button size="sm" variant="primary" onClick={() => setConfirm({ action: 'activate', id: admin._id, name: admin.name })}>Activate</Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => setConfirm({ action: 'remove', id: admin._id, name: admin.name })}>Remove</Button>
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

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Admin">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createAdmin.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={`${confirm?.action?.charAt(0).toUpperCase()}${confirm?.action?.slice(1)} Admin`}
        description={`Are you sure you want to ${confirm?.action} "${confirm?.name}"?`}
        loading={activateAdmin.isPending || deactivateAdmin.isPending || removeAdmin.isPending}
        variant={confirm?.action === 'remove' ? 'danger' : 'primary'}
      />
    </div>
  );
}
