import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';
import type { ListParams } from '../types/common';
import type { CreateAdminRequest } from '../types/admin';

interface AdminListParams extends ListParams {
  role?: string;
}

export function useAdmins(params: AdminListParams) {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: () => api.get('/superadmin/admins', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdminRequest) => api.post('/superadmin/admins', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin created'); },
  });
}

export function useActivateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/superadmin/admins/${id}/activate`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin activated'); },
  });
}

export function useDeactivateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/superadmin/admins/${id}/deactivate`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin deactivated'); },
  });
}

export function useRemoveAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/superadmin/admins/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); toast.success('Admin removed'); },
  });
}
