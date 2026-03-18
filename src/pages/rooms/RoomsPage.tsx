import { useState } from 'react';
import { useRooms, useAbandonRoom } from '../../hooks/use-rooms';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDateTime } from '../../lib/utils';
import type { Room } from '../../types/room';

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useRooms({ page, limit: 20, search, status: status || undefined });
  const abandonRoom = useAbandonRoom();
  const [abandonId, setAbandonId] = useState<string | null>(null);

  const rooms: Room[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Rooms</h2>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search rooms..." className="sm:w-64" />
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Status' },
            { value: 'waiting', label: 'Waiting' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'abandoned', label: 'Abandoned' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : rooms.length === 0 ? (
        <EmptyState message="No rooms found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Players</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Match Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{room.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{room.players?.length ?? 0} / {room.maxPlayers}</td>
                  <td className="px-4 py-3"><StatusBadge status={room.status} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{room.matchType || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDateTime(room.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {(room.status === 'waiting' || room.status === 'active') && (
                      <Button size="sm" variant="danger" onClick={() => setAbandonId(room._id)}>Abandon</Button>
                    )}
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
        open={!!abandonId}
        onClose={() => setAbandonId(null)}
        onConfirm={() => abandonId && abandonRoom.mutate(abandonId, { onSuccess: () => setAbandonId(null) })}
        title="Abandon Room"
        description="Are you sure you want to abandon this room? This cannot be undone."
        loading={abandonRoom.isPending}
      />
    </div>
  );
}
