import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';

export function usePlans(params?: { page?: number; limit?: number; includeInactive?: boolean }) {
  return useQuery({
    queryKey: ['subscription-plans', params],
    queryFn: () => api.get('/subscription-plans', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/subscription-plans', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscription-plans'] }); toast.success('Plan created'); },
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.put(`/subscription-plans/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscription-plans'] }); toast.success('Plan updated'); },
  });
}

export function useDeactivatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.put(`/subscription-plans/${id}/deactivate`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscription-plans'] }); toast.success('Plan deactivated'); },
  });
}
