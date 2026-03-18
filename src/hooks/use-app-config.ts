import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';

export function useAppConfig() {
  return useQuery({
    queryKey: ['app-config'],
    queryFn: () => api.get('/app-config/admin').then((r) => r.data),
  });
}

export function useUpdateAppConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => api.put('/app-config', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['app-config'] }); toast.success('Config updated'); },
  });
}

export function useTestSms() {
  return useMutation({
    mutationFn: (data: { phoneNumber: string }) => api.post('/app-config/test-sms', data),
    onSuccess: () => toast.success('Test SMS sent'),
  });
}

export function useTestSmtp() {
  return useMutation({
    mutationFn: (data: { email: string }) => api.post('/app-config/test-smtp', data),
    onSuccess: () => toast.success('Test email sent'),
  });
}
