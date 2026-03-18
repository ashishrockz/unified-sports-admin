import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none',
        'focus:border-primary focus:ring-1 focus:ring-primary',
        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
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
