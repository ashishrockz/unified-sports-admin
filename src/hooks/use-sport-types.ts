import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';

export function useSportTypes(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['sport-types', params],
    queryFn: () => api.get('/sport-types', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useCreateSportType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/sport-types', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sport-types'] }); toast.success('Sport type created'); },
  });
}

export function useUpdateSportType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/sport-types/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sport-types'] }); toast.success('Sport type updated'); },
  });
}

export function useDeleteSportType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/sport-types/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sport-types'] }); toast.success('Sport type deleted'); },
  });
}
