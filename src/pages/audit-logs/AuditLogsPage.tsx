import { useState } from 'react';
import { useAuditLogs } from '../../hooks/use-audit-logs';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../lib/utils';
import type { AuditLog } from '../../types/auditLog';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [targetModel, setTargetModel] = useState('');
  const { data, isLoading } = useAuditLogs({ page, limit: 30, action: action || undefined, targetModel: targetModel || undefined });

  const logs: AuditLog[] = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Audit Logs</h2>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Actions' },
            { value: 'create', label: 'Create' },
            { value: 'update', label: 'Update' },
            { value: 'delete', label: 'Delete' },
            { value: 'login', label: 'Login' },
            { value: 'ban', label: 'Ban' },
            { value: 'unban', label: 'Unban' },
          ]}
        />
        <Select
          value={targetModel}
          onChange={(e) => { setTargetModel(e.target.value); setPage(1); }}
          options={[
            { value: '', label: 'All Models' },
            { value: 'User', label: 'User' },
            { value: 'Admin', label: 'Admin' },
            { value: 'Match', label: 'Match' },
            { value: 'Room', label: 'Room' },
            { value: 'SportType', label: 'Sport Type' },
            { value: 'ApiKey', label: 'API Key' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : logs.length === 0 ? (
        <EmptyState message="No audit logs found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Actor</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Action</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Target</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">IP</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {typeof log.actor === 'object' ? log.actor.name : log.actor}
                  </td>
                  <td className="px-4 py-3"><Badge variant="info">{log.action}</Badge></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.targetModel}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.ip}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDateTime(log.createdAt)}</td>
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
    </div>
  );
}
