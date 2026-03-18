import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors',
        'focus:border-primary focus:ring-1 focus:ring-primary',
        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
        error && 'border-danger focus:border-danger focus:ring-danger',
        className
      )}
      {...props}
    />
    {error && <p className="text-sm text-danger">{error}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
