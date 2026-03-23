import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { page: number; totalPages: number; onPageChange: (p: number) => void }

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="mt-5 flex items-center justify-between">
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        Page <span className="font-medium text-zinc-700 dark:text-zinc-300">{page}</span> of{' '}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:bg-zinc-50 hover:border-zinc-300 disabled:opacity-40 disabled:pointer-events-none dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <span key={`dots-${i}`} className="px-1 text-zinc-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-all',
                p === page
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:bg-zinc-50 hover:border-zinc-300 disabled:opacity-40 disabled:pointer-events-none dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
