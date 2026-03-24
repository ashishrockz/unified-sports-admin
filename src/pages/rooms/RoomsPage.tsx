import { useState } from 'react';
import { useRooms, useRoomDetail, useAbandonRoom } from '../../hooks/use-rooms';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Can from '../../components/guards/Can';
import { formatDateTime, formatRelative } from '../../lib/utils';
import { Eye, DoorOpen, Clock, Users, Gamepad2, User } from 'lucide-react';
import type { Room } from '../../types/room';

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useRooms({ page, limit: 20, search, status: status || undefined });
  const abandonRoom = useAbandonRoom();
  const [abandonId, setAbandonId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const rooms: Room[] = data?.rooms ?? [];
  const pagination = data?.pagination;

  const canAbandon = (room: Room) => {
    if (room.status === 'completed' || room.status === 'abandoned') return false;
    return true;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Rooms</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{pagination?.total ?? 0} total rooms</p>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search rooms..." className="sm:w-64" />
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Status' },
            { value: 'waiting', label: 'Waiting' },
            { value: 'toss_pending', label: 'Toss Pending' },
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
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 animate-stagger-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Room</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Players</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Teams</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Created</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{room.name}</div>
                    <div className="text-xs text-zinc-400">{room.matchType || 'Standard'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-zinc-700 dark:text-zinc-300">{room.players?.length ?? 0}</span>
                    <span className="text-zinc-400"> / {room.maxPlayers}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={room.status} /></td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {room.teamAName && room.teamBName ? (
                      <span>{room.teamAName} <span className="text-zinc-400">vs</span> {room.teamBName}</span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-500 dark:text-zinc-400">{formatDateTime(room.createdAt)}</div>
                    <div className="text-xs text-zinc-400">{formatRelative(room.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setDetailId(room._id)} title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Can permission="rooms.delete">
                        {canAbandon(room) && (
                          <Button size="sm" variant="danger" onClick={() => setAbandonId(room._id)}>Abandon</Button>
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

      {/* Room Detail Modal */}
      {detailId && <RoomDetailModal roomId={detailId} onClose={() => setDetailId(null)} />}

      <ConfirmDialog
        open={!!abandonId}
        onClose={() => setAbandonId(null)}
        onConfirm={() => abandonId && abandonRoom.mutate(abandonId, { onSuccess: () => setAbandonId(null) })}
        title="Abandon Room"
        description="Are you sure you want to abandon this room? If there's an active match, it will also be abandoned. This cannot be undone."
        loading={abandonRoom.isPending}
      />
    </div>
  );
}

function RoomDetailModal({ roomId, onClose }: { roomId: string; onClose: () => void }) {
  const { data: room, isLoading } = useRoomDetail(roomId);

  return (
    <Modal open onClose={onClose} title="Room Details" className="max-w-2xl">
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : !room ? (
        <p className="text-sm text-zinc-500">Room not found</p>
      ) : (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <div className="flex items-center gap-3">
              <DoorOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{room.name}</p>
                <p className="text-sm text-zinc-500">{room.matchType || 'Standard'} match</p>
              </div>
            </div>
            <StatusBadge status={room.status} />
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Users} label="Players" value={`${room.players?.length ?? 0} / ${room.maxPlayers} (min: ${room.minPlayers})`} />
            <InfoRow icon={Clock} label="Created" value={formatDateTime(room.createdAt)} />
            <InfoRow icon={User} label="Creator" value={typeof room.creator === 'object' ? (room.creator?.name || room.creator?.username || '-') : String(room.creator || '-')} />
            <InfoRow icon={Gamepad2} label="Sport Type" value={typeof room.sportTypeId === 'object' ? (room.sportTypeId?.name || '-') : String(room.sportTypeId || '-')} />
          </div>

          {/* Teams */}
          {(room.teamAName || room.teamBName) && (
            <div className="rounded-xl border border-zinc-200/60 p-3 dark:border-zinc-800">
              <p className="text-[13px] font-medium uppercase tracking-wider text-zinc-400 mb-2">Teams</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{room.teamAName || 'Team A'}</p>
                </div>
                <span className="text-sm text-zinc-400">vs</span>
                <div className="flex-1 text-center">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{room.teamBName || 'Team B'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Toss */}
          {room.toss?.winnerTeam && (
            <div className="rounded-xl border border-zinc-200/60 p-3 dark:border-zinc-800">
              <p className="text-[13px] font-medium uppercase tracking-wider text-zinc-400 mb-2">Toss</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{room.toss.winnerTeam}</span> won and chose to <span className="font-medium">{room.toss.choice}</span>
              </p>
            </div>
          )}

          {/* Players List */}
          {room.players?.length > 0 && (
            <div className="rounded-xl border border-zinc-200/60 p-3 dark:border-zinc-800">
              <p className="text-[13px] font-medium uppercase tracking-wider text-zinc-400 mb-2">Players ({room.players.length})</p>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {room.players.map((p: any, i: number) => {
                  const name = typeof p === 'object'
                    ? (p.userId?.name || p.name || p.username || `Slot ${i + 1}`)
                    : String(p);
                  const team = typeof p === 'object' ? p.team : undefined;
                  const isStatic = typeof p === 'object' && p.isStatic;
                  return (
                    <div key={i} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {typeof name === 'string' ? name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{name}</span>
                        {isStatic && <Badge variant="neutral">Walk-in</Badge>}
                      </div>
                      {team && <Badge variant={team === 'A' ? 'info' : 'warning'}>Team {team}</Badge>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Match Link */}
          {room.matchId && (
            <div className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
              <p className="text-xs text-zinc-400">Match ID: <span className="font-mono">{room.matchId}</span></p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <span className="text-xs text-zinc-400">ID: {room._id}</span>
            <span className="text-xs text-zinc-400">Updated {formatRelative(room.updatedAt)}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200/60 p-3 dark:border-zinc-800">
      <Icon className="h-4 w-4 text-zinc-400" />
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </div>
  );
}
