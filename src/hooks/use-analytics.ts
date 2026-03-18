import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export function useTrends(days = 30) {
  return useQuery({
    queryKey: ['analytics-trends', days],
    queryFn: () => api.get('/analytics/trends', { params: { days } }).then((r) => r.data),
  });
}

export function useEngagement(days = 30) {
  return useQuery({
    queryKey: ['analytics-engagement', days],
    queryFn: () => api.get('/analytics/engagement', { params: { days } }).then((r) => r.data),
  });
}

export function usePlatformSummary() {
  return useQuery({
    queryKey: ['analytics-platform-summary'],
    queryFn: () => api.get('/analytics/platform-summary').then((r) => r.data),
  });
}

export function useGrowth(days = 30) {
  return useQuery({
    queryKey: ['analytics-growth', days],
    queryFn: () => api.get('/analytics/growth', { params: { days } }).then((r) => r.data),
  });
}

export function useRevenue() {
  return useQuery({
    queryKey: ['analytics-revenue'],
    queryFn: () => api.get('/analytics/revenue').then((r) => r.data),
  });
}

export function useMatchAnalytics(days = 30) {
  return useQuery({
    queryKey: ['analytics-match', days],
    queryFn: () => api.get('/analytics/match-analytics', { params: { days } }).then((r) => r.data),
  });
}
