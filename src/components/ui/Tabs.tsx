import { cn } from '../../lib/utils';

interface TabsProps { tabs: { key: string; label: string }[]; active: string; onChange: (key: string) => void }

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn('rounded-md px-4 py-2 text-sm font-medium transition-colors', active === t.key ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200')}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
