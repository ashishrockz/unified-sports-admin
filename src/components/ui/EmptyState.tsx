import { InboxIcon, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function EmptyState({ message = 'No data found', description, icon: Icon = InboxIcon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800/80">
        <Icon className="h-7 w-7 text-zinc-400" />
      </div>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{message}</p>
      {description && <p className="mt-1.5 max-w-sm text-[13px] text-zinc-400 dark:text-zinc-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
