import { useState } from 'react';
import { useMatches, useAbandonMatch } from '../../hooks/use-matches';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDateTime } from '../../lib/utils';
import type { Match } from '../../types/match';

export default function MatchesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useMatches({ page, limit: 20, search, status: status || undefined });
  const abandonMatch = useAbandonMatch();
  const [abandonId, setAbandonId] = useState<string | null>(null);

  const matches: Match[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Matches</h2>
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
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : matches.length === 0 ? (
        <EmptyState message="No matches found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Teams</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Sport</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Result</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {match.teamA?.name ?? 'Team A'} vs {match.teamB?.name ?? 'Team B'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{match.sport}</td>
                  <td className="px-4 py-3"><StatusBadge status={match.status} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{match.result?.description || '-'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDateTime(match.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {(match.status === 'active' || match.status === 'not_started') && (
                      <Button size="sm" variant="danger" onClick={() => setAbandonId(match._id)}>Abandon</Button>
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
        onConfirm={() => abandonId && abandonMatch.mutate(abandonId, { onSuccess: () => setAbandonId(null) })}
        title="Abandon Match"
        description="Are you sure you want to abandon this match? This cannot be undone."
        loading={abandonMatch.isPending}
      />
    </div>
  );
}
