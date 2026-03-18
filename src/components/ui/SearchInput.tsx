import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }

export default function SearchInput({ value, onChange, placeholder = 'Search...', className }: Props) {
  const [local, setLocal] = useState(value);
  useEffect(() => { const t = setTimeout(() => onChange(local), 300); return () => clearTimeout(t); }, [local]);
  useEffect(() => { setLocal(value); }, [value]);
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
