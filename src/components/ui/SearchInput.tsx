import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }

export default function SearchInput({ value, onChange, placeholder = 'Search...', className }: Props) {
  const [local, setLocal] = useState(value);
  useEffect(() => { const t = setTimeout(() => onChange(local), 300); return () => clearTimeout(t); }, [local]);
  useEffect(() => { setLocal(value); }, [value]);

  return (
    <div className={cn('relative group', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-primary" />
      <input
        className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
      {local && (
        <button
          onClick={() => setLocal('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
