import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-zinc-400',
        'focus:border-primary focus:ring-2 focus:ring-primary/10',
        'dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20',
        error && 'border-danger focus:border-danger focus:ring-danger/10',
        className
      )}
      {...props}
    />
    {hint && !error && <p className="text-[12px] text-zinc-400">{hint}</p>}
    {error && <p className="text-[12px] text-danger">{error}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
