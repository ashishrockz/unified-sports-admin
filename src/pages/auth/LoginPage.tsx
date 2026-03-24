import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useLogin } from '../../hooks/use-auth';
import { useAuthStore } from '../../stores/auth.store';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Eye, EyeOff, Zap, Shield, Activity, Users, BarChart3 } from 'lucide-react';

const FEATURES = [
  { icon: Activity, label: 'Live Scoring', desc: 'Real-time ball-by-ball' },
  { icon: Users, label: '10K+ Users', desc: 'Growing community' },
  { icon: BarChart3, label: 'Analytics', desc: 'Deep match insights' },
  { icon: Shield, label: 'RBAC', desc: '5 role levels' },
];

export default function LoginPage() {
  const token = useAuthStore((s) => s.token);
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Brand Panel */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between overflow-hidden bg-gradient-to-br from-sidebar via-slate-900 to-indigo-950 p-12">
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid" />
        {/* Gradient orbs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -right-20 top-1/2 h-60 w-60 rounded-full bg-violet-500/15 blur-[80px]" />
        <div className="absolute bottom-20 left-1/3 h-40 w-40 rounded-full bg-indigo-500/10 blur-[60px]" />

        <div className="relative animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-xl shadow-primary/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Unified Sports</span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary-muted/60">Sports Platform</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-lg animate-slide-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium text-slate-300">Platform Active</span>
          </div>
          <h2 className="text-[42px] font-bold leading-[1.1] tracking-tight">
            <span className="text-gradient-hero">Manage your sports platform</span>{' '}
            <span className="text-slate-400">with confidence</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-400">
            Complete match management, real-time scoring, player analytics, and team administration. Built for scale, designed for simplicity.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="glass rounded-2xl p-4 transition-all duration-300 hover:bg-white/[0.08]"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                <f.icon className="mb-2.5 h-5 w-5 text-primary-muted" />
                <p className="text-[13px] font-semibold text-white">{f.label}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex -space-x-2">
            {['#6366f1', '#8b5cf6', '#a78bfa'].map((c) => (
              <div key={c} className="h-7 w-7 rounded-full border-2 border-sidebar" style={{ background: c }} />
            ))}
          </div>
          <p className="text-[13px] text-slate-500">Trusted by sports organizers worldwide</p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 bg-surface-sunken dark:bg-zinc-950">
        <div className="w-full max-w-[400px] animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Unified Sports</span>
            </div>
            <h1 className="text-[26px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Welcome back</h1>
            <p className="mt-2 text-[14px] text-zinc-500 dark:text-zinc-400">Sign in to your admin dashboard</p>
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
              <div className="space-y-1.5">
                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-primary dark:focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-[13px] font-medium text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-[15px]" size="lg" loading={login.isPending}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-[12px] text-zinc-400">
            Secure login with encrypted credentials
          </p>
        </div>
      </div>
    </div>
  );
}
