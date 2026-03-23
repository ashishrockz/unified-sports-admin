import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../hooks/use-auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword.mutate({ email });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4 dark:bg-zinc-950">
      <div className="w-full max-w-[400px] animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/20">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Forgot Password</h1>
          <p className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400">Enter your email to receive a reset link</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
            <Button type="submit" className="w-full" size="lg" loading={forgotPassword.isPending}>
              Send Reset Link
            </Button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary-hover transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
