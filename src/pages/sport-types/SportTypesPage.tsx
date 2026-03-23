import { useState } from 'react';
import { useSportTypes, useCreateSportType, useUpdateSportType, useDeleteSportType } from '../../hooks/use-sport-types';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { Gamepad2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { SportType } from '../../types/sportType';

export default function SportTypesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useSportTypes({ page, limit: 20, search });

  const createSportType = useCreateSportType();
  const updateSportType = useUpdateSportType();
  const deleteSportType = useDeleteSportType();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SportType | null>(null);
  const [form, setForm] = useState({ name: '', sport: '', description: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sportTypes: SportType[] = data?.sportTypes ?? [];
  const pagination = data?.pagination;

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', sport: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (st: SportType) => {
    setEditing(st);
    setForm({ name: st.name, sport: st.sport, description: st.description ?? '' });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateSportType.mutate({ id: editing._id, ...form }, { onSuccess: () => setShowForm(false) });
    } else {
      createSportType.mutate(form, { onSuccess: () => setShowForm(false) });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between animate-slide-up">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Sport Types</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{sportTypes.length} configured sport types</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Sport Type
        </Button>
      </div>
      <div className="mb-5 animate-stagger-1">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search sport types..." className="sm:w-72" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : sportTypes.length === 0 ? (
        <EmptyState icon={Gamepad2} message="No sport types found" description="Create your first sport type to get started" action={<Button onClick={openCreate} size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Sport Type</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-stagger-2">
          {sportTypes.map((st) => (
            <div key={st._id} className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300/60 dark:border-zinc-800/60 dark:bg-zinc-900 dark:hover:border-zinc-700/60">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light transition-transform duration-200 group-hover:scale-110 dark:bg-primary/10">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{st.name}</h3>
                      <p className="text-[12px] text-zinc-400 capitalize">{st.sport}</p>
                    </div>
                  </div>
                  <Badge variant={st.isActive ? 'success' : 'neutral'} dot>{st.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                {st.description && <p className="mb-4 text-[13px] text-zinc-500 line-clamp-2">{st.description}</p>}
                <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(st)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-danger hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => setDeleteId(st._id)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Sport Type' : 'Add Sport Type'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g., T20 Cricket" />
          <Input label="Sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} required placeholder="e.g., cricket" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
          <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={createSportType.isPending || updateSportType.isPending}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteSportType.mutate(deleteId, { onSuccess: () => setDeleteId(null) })}
        title="Delete Sport Type"
        description="Are you sure you want to delete this sport type? This action cannot be undone."
        loading={deleteSportType.isPending}
      />
    </div>
  );
}
