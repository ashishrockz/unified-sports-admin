import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/axios';

interface NotificationParams {
  page?: number;
  limit?: number;
  type?: string;
  read?: string;
}

export function useNotifications(params: NotificationParams) {
  return useQuery({
    queryKey: ['admin-notifications', params],
    queryFn: () => api.get('/admin/notifications', { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: ['admin-notification-stats'],
    queryFn: () => api.get('/admin/notifications/stats').then((r) => r.data),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/notifications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-notifications'] });
      qc.invalidateQueries({ queryKey: ['admin-notification-stats'] });
      toast.success('Notification deleted');
    },
  });
}
