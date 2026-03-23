// ── Actions ──────────────────────────────────────────────
export const Actions = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

// ── Resources ────────────────────────────────────────────
export const Resources = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  CONTENT: 'content',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  SYSTEM_CONFIG: 'system_config',
  AUDIT_LOGS: 'audit_logs',
  ADMINS: 'admins',
  MATCHES: 'matches',
  ROOMS: 'rooms',
  SPORT_TYPES: 'sport_types',
  NOTIFICATIONS: 'notifications',
} as const;

// ── Permission string format: "resource.action" ─────────
type ResourceKey = typeof Resources[keyof typeof Resources];
type ActionKey = typeof Actions[keyof typeof Actions];
export type Permission = `${ResourceKey}.${ActionKey}`;

// ── Role definitions ─────────────────────────────────────
export type Role = 'super_admin' | 'admin' | 'manager' | 'editor' | 'viewer';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
  admin: 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-500/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  manager: 'bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-500/10 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20',
  editor: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  viewer: 'bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-500/20',
};

const ALL_PERMISSIONS: Permission[] = Object.values(Resources).flatMap((resource) =>
  Object.values(Actions).map((action) => `${resource}.${action}` as Permission)
);

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ALL_PERMISSIONS,

  admin: [
    'dashboard.read',
    'users.read', 'users.create', 'users.update', 'users.delete',
    'content.read', 'content.create', 'content.update', 'content.delete',
    'reports.read',
    'settings.read', 'settings.update',
    'audit_logs.read',
    'admins.read',
    'matches.read', 'matches.update', 'matches.delete',
    'rooms.read', 'rooms.update', 'rooms.delete',
    'sport_types.read', 'sport_types.create', 'sport_types.update', 'sport_types.delete',
    'notifications.read', 'notifications.delete',
  ],

  manager: [
    'dashboard.read',
    'content.read', 'content.create', 'content.update',
    'reports.read', 'reports.create',
    'matches.read',
    'rooms.read',
    'sport_types.read',
  ],

  editor: [
    'dashboard.read',
    'content.read', 'content.create', 'content.update',
    'matches.read',
    'rooms.read',
    'sport_types.read',
  ],

  viewer: [
    'dashboard.read',
    'content.read',
    'reports.read',
    'matches.read',
    'rooms.read',
    'sport_types.read',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms.includes(permission);
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
