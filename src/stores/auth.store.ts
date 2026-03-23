import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '../config/permissions';
import { hasPermission, hasAnyPermission, type Permission } from '../config/permissions';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isSuperAdmin: () => boolean;
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      updateUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
      isSuperAdmin: () => get().user?.role === 'super_admin',
      can: (permission) => {
        const role = get().user?.role;
        if (!role) return false;
        return hasPermission(role, permission);
      },
      canAny: (permissions) => {
        const role = get().user?.role;
        if (!role) return false;
        return hasAnyPermission(role, permissions);
      },
    }),
    { name: 'auth-storage' }
  )
);
