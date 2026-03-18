import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';
import type { ListParams } from '../types/common';
import type { BulkAction } from '../types/user';

export function useUsers(params: ListParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => api.get('/admin/users', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useUserDetail(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.get(`/admin/users/${userId}`).then((r) => r.data),
    enabled: !!userId,
  });
}

function useUserAction(action: string, label: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => api.put(`/admin/users/${userId}/${action}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success(`User ${label}`); },
  });
}

export function useBanUser() { return useUserAction('ban', 'banned'); }
export function useUnbanUser() { return useUserAction('unban', 'unbanned'); }
export function useActivateUser() { return useUserAction('activate', 'activated'); }
export function useDeactivateUser() { return useUserAction('deactivate', 'deactivated'); }

export function useBulkAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { userIds: string[]; action: BulkAction }) => api.put('/admin/users/bulk-action', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Bulk action completed'); },
  });
}

export function useExportUsers(params: { format: string; status?: string }) {
  return () => api.get('/admin/users/export', { params, responseType: 'blob' }).then((r) => {
    const blob = new Blob([r.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users.${params.format}`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
