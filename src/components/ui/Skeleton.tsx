import { cn } from '../../lib/utils';

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden', className)}>
      <div className="absolute inset-0 skeleton-shimmer" />
    </div>
  );
}
