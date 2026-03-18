import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'sonner';
import type { LoginRequest, LoginResponse } from '../types/auth';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (data: LoginRequest) => api.post<LoginResponse>('/admin/login', data).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success('Login successful');
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return () => { logout(); window.location.href = '/login'; };
}

export function useProfile() {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (data: { name: string }) => api.put('/admin/me', data).then((r) => r.data),
    onSuccess: (data) => { updateUser(data.user); toast.success('Profile updated'); },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => api.put('/admin/me/password', data),
    onSuccess: () => toast.success('Password changed'),
  });
}

export function useUploadAvatar() {
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('avatar', file);
      return api.post('/admin/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
    },
    onSuccess: (data) => { updateUser(data.user); toast.success('Avatar updated'); },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) => api.post('/admin/forgot-password', data),
    onSuccess: () => toast.success('Reset email sent'),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) => api.post('/admin/reset-password', data),
    onSuccess: () => toast.success('Password reset successful'),
  });
}
