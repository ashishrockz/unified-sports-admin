import { useState } from 'react';
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '../../hooks/use-api-keys';
import Pagination from '../../components/ui/Pagination';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import type { ApiKey } from '../../types/apiKey';

export default function ApiKeysPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useApiKeys({ page, limit: 20 });

  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const apiKeys: ApiKey[] = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createApiKey.mutate({ name }, {
      onSuccess: (data: any) => {
        setShowCreate(false);
        setName('');
        if (data?.key) setNewKey(data.key);
      },
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">API Keys</h2>
        <Button onClick={() => setShowCreate(true)}>Create API Key</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : apiKeys.length === 0 ? (
        <EmptyState message="No API keys found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Key Prefix</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Rate Limit</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Created</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{key.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{key.keyPrefix}...</td>
                  <td className="px-4 py-3"><StatusBadge status={key.status} /></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{key.rateLimit}/min</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{formatDate(key.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {key.status === 'active' && (
                      <Button size="sm" variant="danger" onClick={() => setRevokeId(key._id)}>Revoke</Button>
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

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create API Key">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Key Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Production API" required />
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createApiKey.isPending}>Create</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!newKey} onClose={() => setNewKey(null)} title="API Key Created">
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Copy this key now. You won't be able to see it again.</p>
        <div className="rounded-lg bg-gray-100 p-3 font-mono text-sm break-all dark:bg-gray-800">{newKey}</div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => { navigator.clipboard.writeText(newKey ?? ''); setNewKey(null); }}>Copy & Close</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!revokeId}
        onClose={() => setRevokeId(null)}
        onConfirm={() => revokeId && revokeApiKey.mutate(revokeId, { onSuccess: () => setRevokeId(null) })}
        title="Revoke API Key"
        description="Are you sure you want to revoke this API key? This cannot be undone."
        loading={revokeApiKey.isPending}
      />
    </div>
  );
}
