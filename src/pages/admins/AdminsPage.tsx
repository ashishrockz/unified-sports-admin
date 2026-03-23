import { useState } from 'react';
import { useAdmins, useCreateAdmin, useActivateAdmin, useDeactivateAdmin, useRemoveAdmin } from '../../hooks/use-admins';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import Can from '../../components/guards/Can';
import { formatDate } from '../../lib/utils';
import { ROLE_LABELS, ROLE_COLORS, type Role } from '../../config/permissions';
import type { Admin } from '../../types/admin';

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

export default function AdminsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { data, isLoading } = useAdmins({ page, limit: 20, search, role: roleFilter || undefined });

  const createAdmin = useCreateAdmin();
  const activateAdmin = useActivateAdmin();
  const deactivateAdmin = useDeactivateAdmin();
  const removeAdmin = useRemoveAdmin();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' as Role });
  const [confirm, setConfirm] = useState<{ action: string; id: string; name: string } | null>(null);

  const admins: Admin[] = data?.admins ?? [];
  const pagination = data?.pagination;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin.mutate(form, {
      onSuccess: () => { setShowCreate(false); setForm({ name: '', email: '', password: '', role: 'editor' }); },
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
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Admins</h2>
          <p className="mt-1 text-[13px] text-zinc-500">Manage admin accounts and roles</p>
        </div>
        <Can permission="admins.create">
          <Button onClick={() => setShowCreate(true)}>Add Admin</Button>
        </Can>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search admins..." className="sm:w-64" />
        <Select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Roles' },
            ...ROLE_OPTIONS,
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : admins.length === 0 ? (
        <EmptyState message="No admins found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 animate-stagger-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Name</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Email</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Role</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Joined</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{admin.name}</td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{admin.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[admin.role] ?? 'bg-zinc-100 text-zinc-600'}`}>
                      {ROLE_LABELS[admin.role] ?? admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={admin.status} /></td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{formatDate(admin.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Can permission="admins.update">
                      <div className="flex justify-end gap-2">
                        {admin.status === 'active' ? (
                          <Button size="sm" variant="outline" onClick={() => setConfirm({ action: 'deactivate', id: admin._id, name: admin.name })}>Deactivate</Button>
                        ) : (
                          <Button size="sm" variant="primary" onClick={() => setConfirm({ action: 'activate', id: admin._id, name: admin.name })}>Activate</Button>
                        )}
                        <Can permission="admins.delete">
                          <Button size="sm" variant="danger" onClick={() => setConfirm({ action: 'remove', id: admin._id, name: admin.name })}>Remove</Button>
                        </Can>
                      </div>
                    </Can>
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
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            options={ROLE_OPTIONS}
          />
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
