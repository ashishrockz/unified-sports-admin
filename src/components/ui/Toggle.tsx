import { cn } from '../../lib/utils';

export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300',
          checked ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-zinc-200 dark:bg-zinc-700'
        )}
      >
        <span className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300',
          checked ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
      {label && <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>}
    </label>
  );
}
