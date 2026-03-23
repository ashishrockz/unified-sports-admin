import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            'w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 pr-9 text-sm outline-none transition-all duration-200',
            'focus:border-primary focus:ring-2 focus:ring-primary/10',
            'dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20',
            className
          )}
          {...props}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}
