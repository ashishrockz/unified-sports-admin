import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Users,
  Swords,
  DoorOpen,
  BarChart3,
  ShieldCheck,
  Settings,
  Key,
  ScrollText,
  CreditCard,
  Building2,
  Gamepad2,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/matches', label: 'Matches', icon: Swords },
  { to: '/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/sport-types', label: 'Sport Types', icon: Gamepad2 },
  { to: '/api-keys', label: 'API Keys', icon: Key },
  { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/app-config', label: 'App Config', icon: Settings },
  { to: '/client', label: 'Client', icon: Building2 },
];

const superAdminItems = [
  { to: '/admins', label: 'Admins', icon: ShieldCheck },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const isSuperAdmin = useAuthStore((s) => s.user?.role === 'superadmin');

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-sidebar-active text-white'
        : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
    );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-bold text-white">Sports Admin</h1>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <>
              <div className="my-3 border-t border-gray-700" />
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Super Admin
              </p>
              {superAdminItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
