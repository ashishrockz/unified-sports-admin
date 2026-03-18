import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  });
}

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ['superadmin-dashboard'],
    queryFn: () => api.get('/superadmin/dashboard').then((r) => r.data),
  });
}
