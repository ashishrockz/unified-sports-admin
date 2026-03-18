import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';
import type { CreateApiKeyRequest } from '../types/apiKey';

export function useApiKeys(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['api-keys', params],
    queryFn: () => api.get('/api-keys', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useApiKeyPermissions() {
  return useQuery({
    queryKey: ['api-key-permissions'],
    queryFn: () => api.get('/api-keys/permissions').then((r) => r.data),
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => api.post('/api-keys', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-keys'] }); toast.success('API key created'); },
  });
}

export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/api-keys/${id}/revoke`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-keys'] }); toast.success('API key revoked'); },
  });
}
