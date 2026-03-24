import { useState } from 'react';
import { useMatches, useMatchDetail, useAbandonMatch } from '../../hooks/use-matches';
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
import { Eye, Swords, Clock, Trophy, Users } from 'lucide-react';
import type { Match } from '../../types/match';

export default function MatchesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useMatches({ page, limit: 20, search, status: status || undefined });
  const abandonMatch = useAbandonMatch();
  const [abandonId, setAbandonId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const matches: Match[] = data?.matches ?? [];
  const pagination = data?.pagination;

  const canAbandon = (match: Match) => {
    if (match.status === 'completed' || match.status === 'abandoned') return false;
    return true;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Matches</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{pagination?.total ?? 0} total matches</p>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search matches..." className="sm:w-64" />
        <Select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'abandoned', label: 'Abandoned' },
            { value: 'not_started', label: 'Not Started' },
            { value: 'innings_break', label: 'Innings Break' },
            { value: 'set_break', label: 'Set Break' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : matches.length === 0 ? (
        <EmptyState message="No matches found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 animate-stagger-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Teams</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Sport</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Result</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {match.teamA?.name ?? 'Team A'} <span className="text-zinc-400">vs</span> {match.teamB?.name ?? 'Team B'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral">{match.sport}</Badge>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={match.status} /></td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">{match.result?.description || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-500 dark:text-zinc-400">{formatDateTime(match.createdAt)}</div>
                    <div className="text-xs text-zinc-400">{formatRelative(match.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setDetailId(match._id)} title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Can permission="matches.delete">
                        {canAbandon(match) && (
                          <Button size="sm" variant="danger" onClick={() => setAbandonId(match._id)}>Abandon</Button>
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

      {/* Match Detail Modal */}
      {detailId && <MatchDetailModal matchId={detailId} onClose={() => setDetailId(null)} />}

      <ConfirmDialog
        open={!!abandonId}
        onClose={() => setAbandonId(null)}
        onConfirm={() => abandonId && abandonMatch.mutate(abandonId, { onSuccess: () => setAbandonId(null) })}
        title="Abandon Match"
        description="Are you sure you want to abandon this match? This will also abandon the associated room. This cannot be undone."
        loading={abandonMatch.isPending}
      />
    </div>
  );
}

function MatchDetailModal({ matchId, onClose }: { matchId: string; onClose: () => void }) {
  const { data: match, isLoading } = useMatchDetail(matchId);

  return (
    <Modal open onClose={onClose} title="Match Details" className="max-w-2xl">
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : !match ? (
        <p className="text-sm text-zinc-500">Match not found</p>
      ) : (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
            <div className="flex items-center gap-3">
              <Swords className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {match.teamA?.name ?? 'Team A'} vs {match.teamB?.name ?? 'Team B'}
                </p>
                <p className="text-sm text-zinc-500 capitalize">{match.sport}</p>
              </div>
            </div>
            <StatusBadge status={match.status} />
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Trophy} label="Result" value={match.result?.description || 'In progress'} />
            <InfoRow icon={Clock} label="Created" value={formatDateTime(match.createdAt)} />
            <InfoRow icon={Users} label="Team A Players" value={`${match.teamA?.players?.length ?? 0} players`} />
            <InfoRow icon={Users} label="Team B Players" value={`${match.teamB?.players?.length ?? 0} players`} />
          </div>

          {/* Toss */}
          {match.toss?.winnerTeam && (
            <div className="rounded-xl border border-zinc-200/60 p-3 dark:border-zinc-800">
              <p className="text-[13px] font-medium uppercase tracking-wider text-zinc-400 mb-2">Toss</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{match.toss.winnerTeam}</span> won the toss and chose to <span className="font-medium">{match.toss.choice}</span>
              </p>
            </div>
          )}

          {/* Teams */}
          <div className="grid gap-4 sm:grid-cols-2">
            <TeamCard name={match.teamA?.name ?? 'Team A'} players={match.teamA?.players ?? []} captain={match.teamA?.captain} />
            <TeamCard name={match.teamB?.name ?? 'Team B'} players={match.teamB?.players ?? []} captain={match.teamB?.captain} />
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <span className="text-xs text-zinc-400">ID: {match._id}</span>
            <span className="text-xs text-zinc-400">Updated {formatRelative(match.updatedAt)}</span>
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

function TeamCard({ name, players, captain }: { name: string; players: any[]; captain?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200/60 p-3 dark:border-zinc-800">
      <p className="mb-2 text-[13px] font-medium uppercase tracking-wider text-zinc-400">{name}</p>
      {players.length === 0 ? (
        <p className="text-sm text-zinc-400">No players</p>
      ) : (
        <div className="space-y-1">
          {players.map((p: any, i: number) => {
            const playerName = typeof p === 'object' ? (p.name || p.username || p.userId?.name || 'Player') : String(p);
            const isCaptain = captain && (typeof p === 'object' ? (p._id === captain || p.userId?._id === captain) : p === captain);
            return (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <span>{playerName}</span>
                {isCaptain && <Badge variant="warning">C</Badge>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
