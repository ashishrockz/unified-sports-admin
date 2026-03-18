import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';

export function useAuditLogs(params: { page?: number; limit?: number; action?: string; actorId?: string; targetModel?: string }) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => api.get('/audit-logs', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}
