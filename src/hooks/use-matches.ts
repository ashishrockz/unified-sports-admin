import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';
import type { ListParams } from '../types/common';

export function useMatches(params: ListParams) {
  return useQuery({
    queryKey: ['admin-matches', params],
    queryFn: () => api.get('/admin/matches', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useMatchDetail(matchId: string) {
  return useQuery({
    queryKey: ['admin-matches', matchId],
    queryFn: () => api.get(`/admin/matches/${matchId}`).then((r) => r.data),
    enabled: !!matchId,
  });
}

export function useAbandonMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => api.put(`/admin/matches/${matchId}/abandon`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-matches'] }); toast.success('Match abandoned'); },
  });
}
