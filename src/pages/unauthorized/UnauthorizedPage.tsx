import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldX className="mb-4 h-16 w-16 text-danger" />
      <h1 className="mb-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Access Denied</h1>
      <p className="mb-6 max-w-md text-zinc-500 dark:text-zinc-400">
        You don't have permission to access this page. Contact your administrator if you believe this is an error.
      </p>
      <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>
  );
}
