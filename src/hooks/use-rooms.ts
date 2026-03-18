import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';
import type { ListParams } from '../types/common';

export function useRooms(params: ListParams) {
  return useQuery({
    queryKey: ['admin-rooms', params],
    queryFn: () => api.get('/admin/rooms', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useRoomDetail(roomId: string) {
  return useQuery({
    queryKey: ['admin-rooms', roomId],
    queryFn: () => api.get(`/admin/rooms/${roomId}`).then((r) => r.data),
    enabled: !!roomId,
  });
}

export function useAbandonRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => api.put(`/admin/rooms/${roomId}/abandon`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-rooms'] }); toast.success('Room abandoned'); },
  });
}
