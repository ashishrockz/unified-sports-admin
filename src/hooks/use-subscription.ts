import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { toast } from 'sonner';

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/subscription').then((r) => r.data),
  });
}

export function useUsage() {
  return useQuery({
    queryKey: ['subscription-usage'],
    queryFn: () => api.get('/subscription/usage').then((r) => r.data),
  });
}

export function useChangePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { planId: string; billingCycle?: string }) => api.put('/subscription/change-plan', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscription'] }); toast.success('Plan changed'); },
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; currency?: string; method?: string; transactionId?: string }) => api.post('/subscription/payment', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscription'] }); toast.success('Payment recorded'); },
  });
}
