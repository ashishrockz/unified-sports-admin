import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 placeholder:text-zinc-400',
        'focus:border-zinc-400 dark:focus:border-zinc-500',
        'dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100',
        error && 'border-danger',
        className
      )}
      rows={4}
      {...props}
    />
    {error && <p className="text-sm text-danger">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';
export default Textarea;
