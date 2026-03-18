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
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
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

  const sportTypes: SportType[] = data?.data ?? [];
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sport Types</h2>
        <Button onClick={openCreate}>Add Sport Type</Button>
      </div>
      <div className="mb-4">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search sport types..." className="sm:w-64" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : sportTypes.length === 0 ? (
        <EmptyState message="No sport types found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sportTypes.map((st) => (
            <div key={st._id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{st.name}</h3>
                <Badge variant={st.isActive ? 'success' : 'neutral'}>{st.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="mb-1 text-sm text-gray-500">Sport: {st.sport}</p>
              {st.description && <p className="mb-3 text-sm text-gray-400">{st.description}</p>}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(st)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteId(st._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Sport Type' : 'Add Sport Type'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3">
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
        description="Are you sure you want to delete this sport type?"
        loading={deleteSportType.isPending}
      />
    </div>
  );
}
