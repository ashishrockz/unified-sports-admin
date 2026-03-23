import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, variant = 'danger' }: Props) {
  const Icon = variant === 'danger' ? AlertTriangle : Info;
  const iconBg = variant === 'danger' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-primary-light dark:bg-primary/10';
  const iconColor = variant === 'danger' ? 'text-danger' : 'text-primary';

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4 mb-6">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pt-2">{description}</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button variant="outline" onClick={onClose} size="sm">Cancel</Button>
        <Button variant={variant} onClick={onConfirm} loading={loading} size="sm">Confirm</Button>
      </div>
    </Modal>
  );
}
