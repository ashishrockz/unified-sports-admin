import {
  LayoutDashboard,
  Users,
  Swords,
  DoorOpen,
  BarChart3,
  ShieldCheck,
  Settings,
  ScrollText,
  Gamepad2,
  Server,
  FileText,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import type { Permission } from './permissions';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  requiredPermission?: Permission;
  section?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Users', path: '/users', icon: Users, requiredPermission: 'users.read' },
  { label: 'Matches', path: '/matches', icon: Swords, requiredPermission: 'matches.read' },
  { label: 'Rooms', path: '/rooms', icon: DoorOpen, requiredPermission: 'rooms.read' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, requiredPermission: 'reports.read' },
  { label: 'Notifications', path: '/notifications', icon: Bell, requiredPermission: 'notifications.read' },
  { label: 'Sport Types', path: '/sport-types', icon: Gamepad2, requiredPermission: 'sport_types.read' },
  { label: 'Audit Logs', path: '/audit-logs', icon: ScrollText, requiredPermission: 'audit_logs.read' },
  { label: 'Settings', path: '/settings', icon: Settings, requiredPermission: 'settings.read' },
  { label: 'System Config', path: '/system-config', icon: Server, requiredPermission: 'system_config.read', section: 'Super Admin' },
  { label: 'Admins', path: '/admins', icon: ShieldCheck, requiredPermission: 'admins.read', section: 'Super Admin' },
];
