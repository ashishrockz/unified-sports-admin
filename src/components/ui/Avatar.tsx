import { cn } from '../../lib/utils';

export default function Avatar({ src, name, size = 'md' }: { src?: string; name?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' };
  const initials = name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  return src ? (
    <img src={src} alt={name} className={cn('rounded-full object-cover', s[size])} />
  ) : (
    <div className={cn('flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary', s[size])}>{initials}</div>
  );
}
