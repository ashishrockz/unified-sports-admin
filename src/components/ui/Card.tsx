import { cn } from '../../lib/utils';

export default function Card({ children, className, title, action }: { children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) {
  return (
    <div className={cn(
      'rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 dark:border-zinc-800/60 dark:bg-zinc-900',
      className
    )}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between">
          {title && <h3 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
