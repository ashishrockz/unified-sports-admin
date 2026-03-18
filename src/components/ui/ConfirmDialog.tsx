import Modal from './Modal';
import Button from './Button';

interface Props { open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; loading?: boolean; variant?: 'danger' | 'primary' }

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading, variant = 'danger' }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>Confirm</Button>
      </div>
    </Modal>
  );
}
