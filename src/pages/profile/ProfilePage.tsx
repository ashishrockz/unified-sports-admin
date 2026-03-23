import { useState, useRef } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useProfile, useChangePassword, useUploadAvatar } from '../../hooks/use-auth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useProfile();
  const changePassword = useChangePassword();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profile.mutate({ name });
  };

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return;
    changePassword.mutate(
      { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
      { onSuccess: () => setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
    );
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Profile</h2>

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar} className="h-20 w-20 rounded-full object-cover" alt="" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-2xl font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white hover:bg-primary-hover transition-colors duration-150"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{user?.name}</p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <p className="text-xs capitalize text-zinc-400">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleProfile} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" value={user?.email ?? ''} disabled />
          <div className="flex justify-end">
            <Button type="submit" loading={profile.isPending}>Update Profile</Button>
          </div>
        </form>
      </Card>

      <Card title="Change Password">
        <form onSubmit={handlePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            error={passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword ? 'Passwords do not match' : undefined}
            required
          />
          <div className="flex justify-end">
            <Button type="submit" loading={changePassword.isPending}>Change Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
