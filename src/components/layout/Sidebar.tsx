import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { cn } from '../../lib/utils';
import { X, LogOut, Zap, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../../config/navigation';
import { hasPermission, ROLE_LABELS } from '../../config/permissions';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const role = user?.role;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.requiredPermission || (role && hasPermission(role, item.requiredPermission))
  );

  const mainItems = visibleItems.filter((item) => !item.section);
  const sectionItems = visibleItems.filter((item) => item.section);

  const sections = sectionItems.reduce<Record<string, typeof sectionItems>>((acc, item) => {
    const key = item.section!;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col transition-transform duration-300 lg:static lg:translate-x-0',
          'bg-gradient-to-b from-sidebar via-sidebar to-slate-950',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-[68px] items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/30">
              <Zap className="h-4.5 w-4.5 text-white" />
              <div className="absolute inset-0 rounded-xl animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-white">CricKet</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-muted/70">Admin Console</p>
            </div>
          </div>
          <button className="rounded-lg p-1.5 text-sidebar-text hover:bg-sidebar-hover hover:text-white lg:hidden transition-colors" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Main Menu
          </p>
          {mainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-active text-white'
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-sm shadow-primary/50" />
                  )}
                  <item.icon className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-all duration-200',
                    isActive ? 'text-primary-muted' : 'text-sidebar-text group-hover:text-slate-300'
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary-muted/50" />}
                </>
              )}
            </NavLink>
          ))}
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} className="pt-5">
              <div className="mx-3 mb-3 border-t border-sidebar-border" />
              <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {section}
              </p>
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-active text-white'
                        : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-sm shadow-primary/50" />
                      )}
                      <item.icon className={cn(
                        'h-[18px] w-[18px] shrink-0 transition-all duration-200',
                        isActive ? 'text-primary-muted' : 'text-sidebar-text group-hover:text-slate-300'
                      )} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary-muted/50" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="border-t border-sidebar-border p-3">
          <div className="group flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 transition-colors duration-200 hover:bg-white/[0.06]">
            {user?.avatar ? (
              <img src={user.avatar} className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10" alt="" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-xs font-bold text-white shadow-sm shadow-primary/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-[13px] font-medium text-white">{user?.name}</p>
              <p className="text-[11px] text-sidebar-text">{role ? ROLE_LABELS[role] : 'Unknown'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-sidebar-text opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-red-400 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
