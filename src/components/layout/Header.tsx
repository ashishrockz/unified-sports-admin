import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { Menu, Moon, Sun, Bell, Search, Command } from 'lucide-react';
import { NAV_ITEMS } from '../../config/navigation';
import { ROLE_LABELS } from '../../config/permissions';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const dark = useThemeStore((s) => s.dark);
  const toggle = useThemeStore((s) => s.toggle);
  const navigate = useNavigate();
  const location = useLocation();

  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentNav?.label || 'Dashboard';

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-zinc-200/60 bg-white/80 px-4 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80 lg:px-6">
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 lg:hidden transition-colors" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{pageTitle}</h2>
          {currentNav && (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              /{currentNav.path.split('/')[1]}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search hint */}
        <div className="hidden items-center gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50 px-3 py-1.5 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
          <Search className="h-3.5 w-3.5" />
          <span className="text-[12px]">Search...</span>
          <kbd className="ml-2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800">
            <Command className="inline h-2.5 w-2.5" />K
          </kbd>
        </div>

        <div className="mx-1 hidden h-5 w-px bg-zinc-200/80 dark:bg-zinc-800 md:block" />

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-300 transition-all duration-200"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-300 transition-all duration-200"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-zinc-950" />
        </button>

        {/* Divider */}
        <div className="mx-1.5 hidden h-5 w-px bg-zinc-200/80 dark:bg-zinc-800 sm:block" />

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all duration-200"
        >
          {user?.avatar ? (
            <img src={user.avatar} className="h-8 w-8 rounded-xl object-cover ring-2 ring-zinc-100 dark:ring-zinc-800" alt="" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-xs font-bold text-white shadow-sm shadow-primary/20 ring-2 ring-primary/10">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{user?.name}</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {user?.role ? ROLE_LABELS[user.role] : user?.email}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
