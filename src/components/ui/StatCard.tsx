import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps { label: string; value: string | number; icon: LucideIcon; color?: string; change?: number }

export default function StatCard({ label, value, icon: Icon, color = 'text-primary', change }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {change !== undefined && (
            <p className={cn('mt-1 text-xs font-medium', change >= 0 ? 'text-green-600' : 'text-red-600')}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={cn('rounded-lg bg-gray-100 p-3 dark:bg-gray-800', color)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
