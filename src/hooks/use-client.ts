import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';

export function useClient() {
  return useQuery({
    queryKey: ['client'],
    queryFn: () => api.get('/client').then((r) => r.data),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.put('/client', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['client'] }); toast.success('Client updated'); },
  });
}

export function useOnboarding() {
  return useQuery({
    queryKey: ['client-onboarding'],
    queryFn: () => api.get('/client/onboarding').then((r) => r.data),
  });
}

export function useCompleteStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (step: string) => api.put(`/client/onboarding/${step}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['client-onboarding'] }); toast.success('Step completed'); },
  });
}

export function useUpdateWhiteLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.put('/client/white-label', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['client'] }); toast.success('White-label updated'); },
  });
}
