import { useState } from 'react';
import { useAuditLogs } from '../../hooks/use-audit-logs';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../lib/utils';
import { ScrollText } from 'lucide-react';
import type { AuditLog } from '../../types/auditLog';

const ACTION_VARIANT: Record<string, string> = {
  create: 'success', update: 'info', delete: 'danger',
  login: 'primary', ban: 'danger', unban: 'warning',
};

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [targetModel, setTargetModel] = useState('');
  const { data, isLoading } = useAuditLogs({ page, limit: 30, action: action || undefined, targetModel: targetModel || undefined });

  const logs: AuditLog[] = data?.logs ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="mb-6 animate-slide-up">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Audit Logs</h2>
        <p className="mt-1 text-[13px] text-zinc-500">Track all admin actions and system events</p>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row animate-stagger-1">
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
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState icon={ScrollText} message="No audit logs found" description="Logs will appear here as admin actions are performed" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 animate-stagger-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Actor</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Action</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Target</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">IP</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {log.actor && typeof log.actor === 'object' ? log.actor.name?.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {log.actor && typeof log.actor === 'object' ? log.actor.name : (log.actor || 'System')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ACTION_VARIANT[log.action.split('.').pop() || ''] || 'info'} dot>{log.action}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral">{log.targetModel}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-zinc-400">{log.ip}</td>
                  <td className="px-4 py-3 text-[13px] text-zinc-500 dark:text-zinc-400">{formatDateTime(log.createdAt)}</td>
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
