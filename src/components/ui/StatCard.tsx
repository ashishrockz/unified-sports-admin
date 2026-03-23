import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  iconBg?: string;
  change?: number;
}

const defaultIconBg = 'bg-primary-light dark:bg-primary/10';

export default function StatCard({ label, value, icon: Icon, color = 'text-primary', iconBg, change }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300/60 dark:border-zinc-800/60 dark:bg-zinc-900 dark:hover:border-zinc-700/60">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-zinc-900 animate-slide-up dark:text-zinc-100">
            {value}
          </p>
          {change !== undefined && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              change >= 0
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
            )}>
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change >= 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm',
          iconBg || defaultIconBg
        )}>
          <Icon className={cn('h-5.5 w-5.5', color)} />
        </div>
      </div>
    </div>
  );
}
