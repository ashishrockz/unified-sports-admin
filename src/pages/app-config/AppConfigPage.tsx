import { useState, useEffect } from 'react';
import { useAppConfig, useUpdateAppConfig, useUploadAdMedia, useTestSms, useTestSmtp } from '../../hooks/use-app-config';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import Can from '../../components/guards/Can';
import { cn } from '../../lib/utils';
import {
  ToggleLeft,
  AlertTriangle,
  Palette,
  FileText,
  Megaphone,
  MonitorSmartphone,
  Plug,
  SlidersHorizontal,
  Save,
  Info,
  CheckCircle2,
  XCircle,
  Send,
  Eye,
  EyeOff,
  Image,
  Film,
  Clock,
  Plus,
  Trash2,
  Upload,
  type LucideIcon,
} from 'lucide-react';

// ── Section config ────────────────────────────────────────────
interface Section {
  key: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const SECTIONS: Section[] = [
  { key: 'features', label: 'Features', icon: ToggleLeft, description: 'Toggle app features on or off' },
  { key: 'settings', label: 'App Limits', icon: SlidersHorizontal, description: 'Pagination, overs, OTP, and timeout settings' },
  { key: 'maintenance', label: 'Maintenance', icon: AlertTriangle, description: 'Maintenance mode and downtime settings' },
  { key: 'branding', label: 'Branding', icon: Palette, description: 'App name, colors, logo, and splash screen' },
  { key: 'content', label: 'Content & Links', icon: FileText, description: 'Legal pages, support, and URLs' },
  { key: 'announcements', label: 'Announcements', icon: Megaphone, description: 'In-app announcements and force update' },
  { key: 'advertisements', label: 'Advertisements', icon: MonitorSmartphone, description: 'Ad placements and sponsor config' },
  { key: 'integrations', label: 'Integrations', icon: Plug, description: 'SMS (Twilio) and email (SMTP) providers' },
];

// ── Feature descriptions ──────────────────────────────────────
const FEATURE_META: Record<string, { label: string; description: string }> = {
  leaderboard: { label: 'Leaderboard', description: 'Show player rankings and leaderboards across sports' },
  friends: { label: 'Friends', description: 'Allow users to add friends and see their activity' },
  rooms: { label: 'Rooms', description: 'Enable game rooms where users can join and compete' },
  highlights: { label: 'Highlights', description: 'Show match highlights and top moments' },
  matchSharing: { label: 'Match Sharing', description: 'Let users share match results externally' },
  userSearch: { label: 'User Search', description: 'Allow searching for other users by name or username' },
};

// ── Helper: SectionCard ───────────────────────────────────────
function SectionCard({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900', className)}>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {description && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Helper: FieldGroup (label row for a sub-section) ──────────
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</h4>
      {children}
    </div>
  );
}

// ── Helper: StatusDot ─────────────────────────────────────────
function StatusDot({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
      <XCircle className="h-3.5 w-3.5" /> Disabled
    </span>
  );
}

// ── Helper: PasswordInput with show/hide ──────────────────────
function PasswordInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ── Helper: HelpTip ───────────────────────────────────────────
function HelpTip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1.5 inline-flex cursor-help">
      <Info className="h-3.5 w-3.5 text-zinc-400" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
        {text}
      </span>
    </span>
  );
}

// ── Helper: MediaUploadField ─────────────────────────────────
function MediaUploadField({
  label,
  value,
  onChange,
  accept,
  uploading,
  onUpload,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <label className={cn(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800',
          uploading && 'pointer-events-none opacity-60',
        )}>
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
      {value && (
        <div className="mt-1">
          {value.match(/\.(mp4)$/i) ? (
            <video src={value} className="h-24 rounded-md border border-zinc-200 dark:border-zinc-700" controls muted />
          ) : (
            <img src={value} alt="Preview" className="h-24 rounded-md border border-zinc-200 object-cover dark:border-zinc-700" />
          )}
        </div>
      )}
    </div>
  );
}

// ── Helper: Phone mockup wrapper ─────────────────────────────
function PhoneMockup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
      <div className="relative w-[200px] rounded-[24px] border-[3px] border-zinc-800 bg-zinc-900 p-1.5 shadow-xl dark:border-zinc-600">
        {/* Notch */}
        <div className="absolute left-1/2 top-1.5 z-10 h-3 w-16 -translate-x-1/2 rounded-full bg-zinc-800 dark:bg-zinc-700" />
        {/* Screen */}
        <div className="relative overflow-hidden rounded-[18px] bg-white dark:bg-zinc-950" style={{ height: 360 }}>
          {children}
        </div>
        {/* Home indicator */}
        <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-zinc-700" />
      </div>
    </div>
  );
}

// ── Helper: Splash Ad Preview ────────────────────────────────
function SplashAdPreview({ config }: { config: any }) {
  const splash = config?.advertisements?.placements?.splash;
  const branding = config?.branding;

  return (
    <PhoneMockup label="Splash Screen Preview">
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-indigo-600 to-indigo-800 p-4 text-center">
        {/* App name */}
        <p className="mb-1 text-lg font-bold text-white">{branding?.appName || 'CricCircle'}</p>
        {branding?.tagline && <p className="mb-4 text-[10px] text-indigo-200">{branding.tagline}</p>}
        {/* Spacer */}
        <div className="flex-1" />
        {/* Sponsor banner at bottom */}
        {splash?.enabled && splash?.mediaUrl ? (
          <div className="w-full overflow-hidden rounded-lg">
            {splash.mediaType === 'video' ? (
              <video src={splash.mediaUrl} className="h-20 w-full rounded-lg object-cover" muted autoPlay loop />
            ) : (
              <img src={splash.mediaUrl} alt="Ad" className="h-20 w-full rounded-lg object-cover" />
            )}
            <div className="flex items-center gap-1 px-1 pt-1">
              <span className="rounded bg-zinc-500 px-1 py-px text-[7px] font-bold text-white">Ad</span>
              {splash.sponsorName && <span className="text-[8px] text-indigo-200">{splash.sponsorName}</span>}
            </div>
          </div>
        ) : (
          <div className="flex h-20 w-full items-center justify-center rounded-lg border border-dashed border-indigo-400/40 text-[9px] text-indigo-300">
            No splash ad configured
          </div>
        )}
      </div>
    </PhoneMockup>
  );
}

// ── Helper: Home Banner Ad Preview ───────────────────────────
function HomeBannerPreview({ config }: { config: any }) {
  const banner = config?.advertisements?.placements?.homeBanner;

  return (
    <PhoneMockup label="Home Screen Preview">
      <div className="flex h-full flex-col bg-zinc-50">
        {/* Fake header */}
        <div className="flex items-center justify-between bg-indigo-600 px-3 py-2">
          <p className="text-[10px] font-semibold text-white">{config?.branding?.appName || 'CricCircle'}</p>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-indigo-300" />
            <div className="h-2 w-2 rounded-full bg-indigo-300" />
          </div>
        </div>

        <div className="flex-1 space-y-2 p-2">
          {/* Banner ad */}
          {banner?.enabled && banner?.mediaUrl ? (
            <div className="overflow-hidden rounded-md">
              {banner.mediaType === 'video' ? (
                <video src={banner.mediaUrl} className="h-24 w-full rounded-md object-cover" muted autoPlay loop />
              ) : (
                <img src={banner.mediaUrl} alt="Ad" className="h-24 w-full rounded-md object-cover" />
              )}
              <div className="flex items-center gap-1 px-1 pt-0.5">
                <span className="rounded bg-zinc-500 px-1 py-px text-[7px] font-bold text-white">Ad</span>
                {banner.sponsorName && <span className="text-[8px] text-zinc-500">{banner.sponsorName}</span>}
              </div>
            </div>
          ) : (
            <div className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-zinc-300 text-[9px] text-zinc-400">
              No banner ad configured
            </div>
          )}

          {/* Fake content cards */}
          <div className="space-y-1.5">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-white p-2 shadow-sm">
                <div className="h-8 w-8 rounded-md bg-zinc-200" />
                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-3/4 rounded bg-zinc-200" />
                  <div className="h-1.5 w-1/2 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-around border-t border-zinc-200 bg-white px-2 py-1.5">
          {['Home', 'Matches', 'Stats', 'Profile'].map((t) => (
            <div key={t} className="flex flex-col items-center gap-0.5">
              <div className={cn('h-2.5 w-2.5 rounded-full', t === 'Home' ? 'bg-indigo-500' : 'bg-zinc-300')} />
              <span className={cn('text-[6px]', t === 'Home' ? 'font-semibold text-indigo-600' : 'text-zinc-400')}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </PhoneMockup>
  );
}

// ── Helper: Toss Sponsor Preview ─────────────────────────────
function TossSponsorPreview({ config }: { config: any }) {
  const toss = config?.advertisements?.placements?.tossScreen;

  return (
    <PhoneMockup label="Toss Screen Preview">
      <div className="flex h-full flex-col items-center bg-gradient-to-b from-emerald-600 to-emerald-800 p-3 text-center">
        <p className="mt-4 text-xs font-bold text-white">Toss</p>
        <p className="mb-4 text-[8px] text-emerald-200">Tap the coin to flip</p>

        {/* Coin */}
        <div className="my-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 shadow-lg">
          <span className="text-lg font-bold text-amber-800">H</span>
        </div>

        <div className="flex-1" />

        {/* Sponsor area */}
        {toss?.enabled && toss?.logoUrl ? (
          <div className="flex flex-col items-center">
            <div className="rounded-lg border border-emerald-400/30 bg-white/10 p-2 backdrop-blur-sm">
              <img src={toss.logoUrl} alt="Sponsor" className="h-8 w-20 object-contain" />
            </div>
            {toss.sponsorName && (
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-[7px] text-emerald-300">Powered by</span>
                <span className="text-[8px] font-semibold text-white">{toss.sponsorName}</span>
              </div>
            )}
            {toss.tagline && <span className="text-[7px] text-emerald-300">{toss.tagline}</span>}
          </div>
        ) : (
          <div className="flex h-16 w-full items-center justify-center rounded-lg border border-dashed border-emerald-400/40 text-[9px] text-emerald-300">
            No toss sponsor configured
          </div>
        )}
        <div className="h-3" />
      </div>
    </PhoneMockup>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AppConfigPage() {
  const { data: config, isLoading } = useAppConfig();
  const updateConfig = useUpdateAppConfig();
  const uploadMedia = useUploadAdMedia();
  const testSms = useTestSms();
  const testSmtp = useTestSmtp();

  const [activeSection, setActiveSection] = useState('features');
  const [form, setForm] = useState<Record<string, any>>({});
  const [testPhone, setTestPhone] = useState('');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  // ── Deep field updater ────────────────────────────────────
  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...form };
    let obj: any = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setForm(updated);
  };

  const handleSave = () => updateConfig.mutate(form);

  const handleMediaUpload = (fieldPath: string) => (file: File) => {
    uploadMedia.mutate(file, {
      onSuccess: (data) => updateField(fieldPath, data.url),
    });
  };

  // ── Section renderers ─────────────────────────────────────
  const renderFeatures = () => (
    <SectionCard title="Feature Flags" description="Enable or disable app features. Changes take effect for all users on next app launch.">
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {form.features && Object.entries(form.features).map(([key, val]) => {
          const meta = FEATURE_META[key] || { label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()), description: '' };
          return (
            <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="pr-4">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{meta.label}</p>
                {meta.description && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{meta.description}</p>}
              </div>
              <Toggle checked={!!val} onChange={(v) => updateField(`features.${key}`, v)} />
            </div>
          );
        })}
      </div>
    </SectionCard>
  );

  const renderAppSettings = () => (
    <div className="space-y-6">
      <SectionCard title="Pagination & List Limits" description="Control how many items are loaded per page across the app.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Input label="Default Pagination" type="number" min={1} max={100} value={form.settings?.paginationLimit ?? 20} onChange={(e) => updateField('settings.paginationLimit', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Items per page in lists</p>
          </div>
          <div>
            <Input label="Room List Limit" type="number" min={1} max={100} value={form.settings?.roomListLimit ?? 20} onChange={(e) => updateField('settings.roomListLimit', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Rooms shown per page</p>
          </div>
          <div>
            <Input label="Leaderboard Limit" type="number" min={1} max={200} value={form.settings?.leaderboardLimit ?? 50} onChange={(e) => updateField('settings.leaderboardLimit', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Players on leaderboard</p>
          </div>
          <div>
            <Input label="Commentary Limit" type="number" min={1} max={200} value={form.settings?.commentaryLimit ?? 50} onChange={(e) => updateField('settings.commentaryLimit', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Commentary entries loaded</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Match Rules" description="Configure overs range for cricket matches.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input label="Minimum Overs" type="number" min={1} max={50} value={form.settings?.minOvers ?? 1} onChange={(e) => updateField('settings.minOvers', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Smallest allowed over count</p>
          </div>
          <div>
            <Input label="Maximum Overs" type="number" min={1} max={50} value={form.settings?.maxOvers ?? 50} onChange={(e) => updateField('settings.maxOvers', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Largest allowed over count</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="OTP Settings" description="One-time password configuration for user verification.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input label="OTP Length" type="number" min={4} max={8} value={form.settings?.otpLength ?? 6} onChange={(e) => updateField('settings.otpLength', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Number of digits (4–8)</p>
          </div>
          <div>
            <Input label="Resend Cooldown (sec)" type="number" min={10} max={300} value={form.settings?.otpResendSeconds ?? 60} onChange={(e) => updateField('settings.otpResendSeconds', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Seconds before resend is allowed</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Network & Socket" description="API timeout and WebSocket reconnection behavior.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Input label="API Timeout (ms)" type="number" min={1000} max={60000} step={1000} value={form.settings?.apiTimeoutMs ?? 10000} onChange={(e) => updateField('settings.apiTimeoutMs', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Request timeout in milliseconds</p>
          </div>
          <div>
            <Input label="Reconnect Attempts" type="number" min={1} max={20} value={form.settings?.socketReconnectAttempts ?? 5} onChange={(e) => updateField('settings.socketReconnectAttempts', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Max socket reconnect tries</p>
          </div>
          <div>
            <Input label="Reconnect Delay (ms)" type="number" min={500} max={30000} step={500} value={form.settings?.socketReconnectDelayMs ?? 3000} onChange={(e) => updateField('settings.socketReconnectDelayMs', Number(e.target.value))} />
            <p className="mt-1 text-xs text-zinc-400">Delay between reconnect attempts</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderMaintenance = () => (
    <SectionCard title="Maintenance Mode" description="When enabled, all mobile API endpoints return 503. Staff dashboard remains accessible.">
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Enable Maintenance Mode</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Users will see a maintenance screen instead of the app</p>
          </div>
          <Toggle checked={!!form.maintenance?.enabled} onChange={(v) => updateField('maintenance.enabled', v)} />
        </div>

        {form.maintenance?.enabled && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Maintenance mode is currently active</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" value={form.maintenance?.title ?? ''} onChange={(e) => updateField('maintenance.title', e.target.value)} placeholder="We'll be right back" />
          <Input label="Estimated End Time" type="datetime-local" value={form.maintenance?.estimatedEndTime ?? ''} onChange={(e) => updateField('maintenance.estimatedEndTime', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
          <textarea
            value={form.maintenance?.message ?? ''}
            onChange={(e) => updateField('maintenance.message', e.target.value)}
            placeholder="We're performing scheduled maintenance. Please check back soon."
            rows={3}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
      </div>
    </SectionCard>
  );

  const renderBranding = () => (
    <div className="space-y-6">
      <SectionCard title="App Branding" description="Customize the app's identity. Changes reflect across mobile and web.">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="App Name" value={form.branding?.appName ?? ''} onChange={(e) => updateField('branding.appName', e.target.value)} placeholder="Unified Sports" />
            <Input label="Tagline" value={form.branding?.tagline ?? ''} onChange={(e) => updateField('branding.tagline', e.target.value)} placeholder="Play. Compete. Win." />
          </div>

          <FieldGroup label="Colors">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input label="Primary Color" type="color" value={form.branding?.primaryColor ?? '#3b82f6'} onChange={(e) => updateField('branding.primaryColor', e.target.value)} />
                </div>
                <div className="mb-1 flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: form.branding?.primaryColor ?? '#3b82f6' }} />
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{form.branding?.primaryColor ?? '#3b82f6'}</span>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input label="Accent Color" type="color" value={form.branding?.accentColor ?? '#f59e0b'} onChange={(e) => updateField('branding.accentColor', e.target.value)} />
                </div>
                <div className="mb-1 flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: form.branding?.accentColor ?? '#f59e0b' }} />
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{form.branding?.accentColor ?? '#f59e0b'}</span>
                </div>
              </div>
            </div>
          </FieldGroup>

          <FieldGroup label="Logo">
            <MediaUploadField
              label="Logo URL"
              value={form.branding?.logoUrl ?? ''}
              onChange={(v) => updateField('branding.logoUrl', v)}
              accept="image/jpeg,image/png"
              uploading={uploadMedia.isPending}
              onUpload={handleMediaUpload('branding.logoUrl')}
              placeholder="https://example.com/logo.png"
            />
          </FieldGroup>
        </div>
      </SectionCard>

      {/* Splash Screen Configuration */}
      <SectionCard title="Splash Screen" description="Configure the splash screen shown when the mobile app launches. Upload an image or video with a duration between 10–20 seconds.">
        <div className="space-y-5">
          {/* Enable toggle */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Custom Splash Screen</p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Replace the default splash with custom media</p>
            </div>
            <Toggle checked={!!form.branding?.splashScreen?.enabled} onChange={(v) => updateField('branding.splashScreen.enabled', v)} />
          </div>

          {form.branding?.splashScreen?.enabled && (
            <>
              {/* Media type + Duration row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Media Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('branding.splashScreen.mediaType', 'image')}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                        (form.branding?.splashScreen?.mediaType ?? 'image') === 'image'
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                          : 'border-zinc-200 text-zinc-500 hover:border-zinc-200 dark:border-zinc-800 dark:text-zinc-400'
                      )}
                    >
                      <Image className="h-4 w-4" /> Image
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('branding.splashScreen.mediaType', 'video')}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                        form.branding?.splashScreen?.mediaType === 'video'
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                          : 'border-zinc-200 text-zinc-500 hover:border-zinc-200 dark:border-zinc-800 dark:text-zinc-400'
                      )}
                    >
                      <Film className="h-4 w-4" /> Video
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Duration (seconds)<HelpTip text="How long the splash screen is displayed. Min 10s, max 20s." />
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={10}
                      max={20}
                      step={1}
                      value={form.branding?.splashScreen?.durationSeconds ?? 10}
                      onChange={(e) => updateField('branding.splashScreen.durationSeconds', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>10s</span>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono font-medium text-primary">{form.branding?.splashScreen?.durationSeconds ?? 10}s</span>
                      <span>20s</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input label="Background Color" type="color" value={form.branding?.splashScreen?.backgroundColor ?? '#FFFFFF'} onChange={(e) => updateField('branding.splashScreen.backgroundColor', e.target.value)} />
                  </div>
                  <div className="mb-1 flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                    <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: form.branding?.splashScreen?.backgroundColor ?? '#FFFFFF' }} />
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{form.branding?.splashScreen?.backgroundColor ?? '#FFFFFF'}</span>
                  </div>
                </div>
              </div>

              {/* Media URL */}
              <div>
                <MediaUploadField
                  label={form.branding?.splashScreen?.mediaType === 'video' ? 'Video URL' : 'Image URL'}
                  value={form.branding?.splashScreen?.mediaUrl ?? ''}
                  onChange={(v) => updateField('branding.splashScreen.mediaUrl', v)}
                  accept={form.branding?.splashScreen?.mediaType === 'video' ? 'video/mp4' : 'image/jpeg,image/png'}
                  uploading={uploadMedia.isPending}
                  onUpload={handleMediaUpload('branding.splashScreen.mediaUrl')}
                  placeholder={form.branding?.splashScreen?.mediaType === 'video' ? 'https://example.com/splash.mp4' : 'https://example.com/splash.png'}
                />
                <p className="mt-1 text-xs text-zinc-400">
                  {form.branding?.splashScreen?.mediaType === 'video'
                    ? 'Supported formats: MP4. Keep file size under 50 MB.'
                    : 'Supported formats: PNG, JPG. Recommended size: 1080x1920 (portrait).'}
                </p>
              </div>

              {/* Media preview */}
              {form.branding?.splashScreen?.mediaUrl && (
                <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Preview</p>
                  <div
                    className="relative mx-auto flex h-64 w-36 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-700"
                    style={{ backgroundColor: form.branding?.splashScreen?.backgroundColor ?? '#FFFFFF' }}
                  >
                    {/* Phone frame with media */}
                    {form.branding?.splashScreen?.mediaType === 'video' ? (
                      <video
                        src={form.branding.splashScreen.mediaUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        autoPlay
                        loop
                        playsInline
                        onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                      />
                    ) : (
                      <img
                        src={form.branding.splashScreen.mediaUrl}
                        alt="Splash preview"
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    {/* Overlay text preview */}
                    <div className="relative z-10 text-center">
                      {form.branding?.splashScreen?.showAppName && (
                        <p className="text-sm font-bold text-zinc-900 drop-shadow-sm" style={{ color: form.branding?.primaryColor || undefined }}>
                          {form.branding?.appName || 'CricCircle'}
                        </p>
                      )}
                      {form.branding?.splashScreen?.showTagline && form.branding?.tagline && (
                        <p className="mt-0.5 text-[8px] text-zinc-500">{form.branding.tagline}</p>
                      )}
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                      <Clock className="h-2.5 w-2.5 text-white" />
                      <span className="text-[9px] font-medium text-white">{form.branding?.splashScreen?.durationSeconds ?? 10}s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Text overlay options */}
              <FieldGroup label="Text Overlay">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Show App Name</p>
                      <p className="text-xs text-zinc-400">Display "{form.branding?.appName || 'CricCircle'}" on the splash screen</p>
                    </div>
                    <Toggle checked={form.branding?.splashScreen?.showAppName ?? true} onChange={(v) => updateField('branding.splashScreen.showAppName', v)} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Show Tagline</p>
                      <p className="text-xs text-zinc-400">Display the tagline below the app name</p>
                    </div>
                    <Toggle checked={form.branding?.splashScreen?.showTagline ?? true} onChange={(v) => updateField('branding.splashScreen.showTagline', v)} />
                  </div>
                </div>
              </FieldGroup>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );

  const renderContent = () => (
    <SectionCard title="Content & Links" description="Legal pages and support contact visible to users in the app.">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Terms of Service URL" value={form.content?.termsUrl ?? ''} onChange={(e) => updateField('content.termsUrl', e.target.value)} placeholder="https://example.com/terms" />
          <Input label="Privacy Policy URL" value={form.content?.privacyUrl ?? ''} onChange={(e) => updateField('content.privacyUrl', e.target.value)} placeholder="https://example.com/privacy" />
        </div>
        <Input label="Support Email" type="email" value={form.content?.supportEmail ?? ''} onChange={(e) => updateField('content.supportEmail', e.target.value)} placeholder="support@example.com" />
      </div>
    </SectionCard>
  );

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <SectionCard title="In-App Announcement" description="Display a banner or alert to all users when they open the app.">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Show Announcement</p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Visible on the app home screen</p>
            </div>
            <Toggle checked={!!form.content?.announcement?.enabled} onChange={(v) => updateField('content.announcement.enabled', v)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.content?.announcement?.title ?? ''} onChange={(e) => updateField('content.announcement.title', e.target.value)} placeholder="New Feature Available!" />
            <Select
              label="Type"
              value={form.content?.announcement?.type ?? 'info'}
              onChange={(e) => updateField('content.announcement.type', e.target.value)}
              options={[
                { value: 'info', label: 'Info (Blue)' },
                { value: 'success', label: 'Success (Green)' },
                { value: 'warning', label: 'Warning (Yellow)' },
                { value: 'error', label: 'Error (Red)' },
              ]}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
            <textarea
              value={form.content?.announcement?.message ?? ''}
              onChange={(e) => updateField('content.announcement.message', e.target.value)}
              placeholder="Check out our latest features and improvements..."
              rows={3}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Force Update" description="Require users on old app versions to update before continuing.">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Enable Force Update</p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Block app usage below the minimum version</p>
            </div>
            <Toggle checked={!!form.content?.forceUpdate?.enabled} onChange={(v) => updateField('content.forceUpdate.enabled', v)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Input label="Minimum Version" value={form.content?.forceUpdate?.minVersion ?? ''} onChange={(e) => updateField('content.forceUpdate.minVersion', e.target.value)} placeholder="1.2.0" />
              <p className="mt-1 text-xs text-zinc-400">Semver format (e.g. 1.2.0)</p>
            </div>
            <Input label="Update URL" value={form.content?.forceUpdate?.updateUrl ?? ''} onChange={(e) => updateField('content.forceUpdate.updateUrl', e.target.value)} placeholder="https://play.google.com/store/apps/..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Update Message</label>
            <textarea
              value={form.content?.forceUpdate?.message ?? ''}
              onChange={(e) => updateField('content.forceUpdate.message', e.target.value)}
              placeholder="A new version is available. Please update to continue using the app."
              rows={2}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 dark:focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderAdvertisements = () => (
    <div className="space-y-6">
      <SectionCard title="Advertisement Settings" description="Control ad placements and sponsor branding across the app.">
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Enable Advertisements</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Master switch for all ad placements</p>
          </div>
          <Toggle checked={!!form.advertisements?.enabled} onChange={(v) => updateField('advertisements.enabled', v)} />
        </div>
      </SectionCard>

      {form.advertisements?.enabled && (
        <>
          {/* ── Live Preview ──────────────────────────────── */}
          <SectionCard title="Live Preview" description="See how your ads will appear on the mobile app.">
            <div className="flex flex-wrap justify-center gap-6">
              <SplashAdPreview config={form} />
              <HomeBannerPreview config={form} />
              <TossSponsorPreview config={form} />
            </div>
          </SectionCard>

          {/* Splash Screen Ad */}
          <SectionCard title="Splash Screen Ad" description="Full-screen ad shown when the app launches.">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
                <Toggle checked={!!form.advertisements?.placements?.splash?.enabled} onChange={(v) => updateField('advertisements.placements.splash.enabled', v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Media Type"
                  value={form.advertisements?.placements?.splash?.mediaType ?? 'image'}
                  onChange={(e) => updateField('advertisements.placements.splash.mediaType', e.target.value)}
                  options={[{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }]}
                />
                <Input label="Sponsor Name" value={form.advertisements?.placements?.splash?.sponsorName ?? ''} onChange={(e) => updateField('advertisements.placements.splash.sponsorName', e.target.value)} placeholder="Acme Corp" />
              </div>
              <MediaUploadField
                label="Media URL"
                value={form.advertisements?.placements?.splash?.mediaUrl ?? ''}
                onChange={(v) => updateField('advertisements.placements.splash.mediaUrl', v)}
                accept={form.advertisements?.placements?.splash?.mediaType === 'video' ? 'video/mp4' : 'image/jpeg,image/png'}
                uploading={uploadMedia.isPending}
                onUpload={handleMediaUpload('advertisements.placements.splash.mediaUrl')}
                placeholder="https://example.com/splash-ad.jpg"
              />
              <Input label="Click-Through URL" value={form.advertisements?.placements?.splash?.linkUrl ?? ''} onChange={(e) => updateField('advertisements.placements.splash.linkUrl', e.target.value)} placeholder="https://sponsor.com/promo" />
            </div>
          </SectionCard>

          {/* Home Banner Ad */}
          <SectionCard title="Home Banner Ad" description="Banner displayed on the app home screen.">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
                <Toggle checked={!!form.advertisements?.placements?.homeBanner?.enabled} onChange={(v) => updateField('advertisements.placements.homeBanner.enabled', v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Media Type"
                  value={form.advertisements?.placements?.homeBanner?.mediaType ?? 'image'}
                  onChange={(e) => updateField('advertisements.placements.homeBanner.mediaType', e.target.value)}
                  options={[{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }]}
                />
                <Input label="Sponsor Name" value={form.advertisements?.placements?.homeBanner?.sponsorName ?? ''} onChange={(e) => updateField('advertisements.placements.homeBanner.sponsorName', e.target.value)} placeholder="Acme Corp" />
              </div>
              <MediaUploadField
                label="Media URL"
                value={form.advertisements?.placements?.homeBanner?.mediaUrl ?? ''}
                onChange={(v) => updateField('advertisements.placements.homeBanner.mediaUrl', v)}
                accept={form.advertisements?.placements?.homeBanner?.mediaType === 'video' ? 'video/mp4' : 'image/jpeg,image/png'}
                uploading={uploadMedia.isPending}
                onUpload={handleMediaUpload('advertisements.placements.homeBanner.mediaUrl')}
                placeholder="https://example.com/banner-ad.jpg"
              />
              <Input label="Click-Through URL" value={form.advertisements?.placements?.homeBanner?.linkUrl ?? ''} onChange={(e) => updateField('advertisements.placements.homeBanner.linkUrl', e.target.value)} placeholder="https://sponsor.com/promo" />
            </div>
          </SectionCard>

          {/* Toss Screen Ad */}
          <SectionCard title="Toss Screen Sponsor" description="Sponsor branding shown on the coin toss screen before matches.">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Active</span>
                <Toggle checked={!!form.advertisements?.placements?.tossScreen?.enabled} onChange={(v) => updateField('advertisements.placements.tossScreen.enabled', v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Sponsor Name" value={form.advertisements?.placements?.tossScreen?.sponsorName ?? ''} onChange={(e) => updateField('advertisements.placements.tossScreen.sponsorName', e.target.value)} placeholder="Acme Corp" />
                <Input label="Tagline" value={form.advertisements?.placements?.tossScreen?.tagline ?? ''} onChange={(e) => updateField('advertisements.placements.tossScreen.tagline', e.target.value)} placeholder="Powered by Acme" />
              </div>
              <MediaUploadField
                label="Logo URL"
                value={form.advertisements?.placements?.tossScreen?.logoUrl ?? ''}
                onChange={(v) => updateField('advertisements.placements.tossScreen.logoUrl', v)}
                accept="image/jpeg,image/png"
                uploading={uploadMedia.isPending}
                onUpload={handleMediaUpload('advertisements.placements.tossScreen.logoUrl')}
                placeholder="https://example.com/sponsor-logo.png"
              />
            </div>
          </SectionCard>

          {/* ── AdMob / Network Ads ──────────────────────────── */}
          <SectionCard title="AdMob / Network Ads" description="Configure Google AdMob ad units. Each unit maps an ad type to a screen placement.">
            <div className="space-y-5">
              {/* Global AdMob toggle */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Enable AdMob</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Master switch for all AdMob ad units</p>
                </div>
                <Toggle checked={!!form.advertisements?.admob?.enabled} onChange={(v) => updateField('advertisements.admob.enabled', v)} />
              </div>

              {form.advertisements?.admob?.enabled && (
                <>
                  {/* Units list */}
                  {(form.advertisements?.admob?.units ?? []).map((unit: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          Unit {idx + 1}{unit.label ? ` — ${unit.label}` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={!!unit.enabled}
                            onChange={(v) => {
                              const units = [...(form.advertisements?.admob?.units ?? [])];
                              units[idx] = { ...units[idx], enabled: v };
                              updateField('advertisements.admob.units', units);
                            }}
                          />
                          <button
                            onClick={() => {
                              const units = [...(form.advertisements?.admob?.units ?? [])];
                              units.splice(idx, 1);
                              updateField('advertisements.admob.units', units);
                            }}
                            className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                            title="Remove unit"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          label="Ad Unit ID"
                          value={unit.unitId ?? ''}
                          onChange={(e) => {
                            const units = [...(form.advertisements?.admob?.units ?? [])];
                            units[idx] = { ...units[idx], unitId: e.target.value };
                            updateField('advertisements.admob.units', units);
                          }}
                          placeholder="ca-app-pub-xxx/yyy"
                        />
                        <Input
                          label="Label"
                          value={unit.label ?? ''}
                          onChange={(e) => {
                            const units = [...(form.advertisements?.admob?.units ?? [])];
                            units[idx] = { ...units[idx], label: e.target.value };
                            updateField('advertisements.admob.units', units);
                          }}
                          placeholder="Home Banner"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <Select
                          label="Ad Type"
                          value={unit.adType ?? 'banner'}
                          onChange={(e) => {
                            const units = [...(form.advertisements?.admob?.units ?? [])];
                            units[idx] = { ...units[idx], adType: e.target.value };
                            updateField('advertisements.admob.units', units);
                          }}
                          options={[
                            { value: 'banner', label: 'Banner' },
                            { value: 'interstitial', label: 'Interstitial' },
                            { value: 'rewarded', label: 'Rewarded' },
                          ]}
                        />
                        <Select
                          label="Placement"
                          value={unit.placement ?? 'home'}
                          onChange={(e) => {
                            const units = [...(form.advertisements?.admob?.units ?? [])];
                            units[idx] = { ...units[idx], placement: e.target.value };
                            updateField('advertisements.admob.units', units);
                          }}
                          options={[
                            { value: 'home', label: 'Home Screen' },
                            { value: 'toss', label: 'Toss Screen' },
                            { value: 'match_detail', label: 'Match Detail' },
                            { value: 'leaderboard', label: 'Leaderboard' },
                            { value: 'room_list', label: 'Room List' },
                            { value: 'scoring', label: 'Scoring Screen' },
                            { value: 'innings_break', label: 'Innings Break' },
                          ]}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Unit button */}
                  <button
                    onClick={() => {
                      const units = [...(form.advertisements?.admob?.units ?? [])];
                      units.push({ unitId: '', adType: 'banner', placement: 'home', enabled: true, label: '' });
                      updateField('advertisements.admob.units', units);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:border-emerald-400 hover:text-emerald-600 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                  >
                    <Plus size={16} />
                    Add Ad Unit
                  </button>

                  {(form.advertisements?.admob?.units ?? []).length === 0 && (
                    <div className="rounded-lg bg-zinc-50 p-4 text-center text-sm text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                      No ad units configured yet. Click "Add Ad Unit" to create one.
                    </div>
                  )}
                </>
              )}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      {/* Twilio SMS */}
      <SectionCard
        title="Twilio SMS"
        description="Send OTP and notification SMS to users via Twilio."
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Twilio SMS</p>
                <StatusDot active={!!form.integrations?.twilio?.enabled} />
              </div>
            </div>
            <Toggle checked={!!form.integrations?.twilio?.enabled} onChange={(v) => updateField('integrations.twilio.enabled', v)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Account SID" value={form.integrations?.twilio?.accountSid ?? ''} onChange={(e) => updateField('integrations.twilio.accountSid', e.target.value)} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
            <PasswordInput label="Auth Token" value={form.integrations?.twilio?.authToken ?? ''} onChange={(v) => updateField('integrations.twilio.authToken', v)} placeholder="Your Twilio auth token" />
          </div>
          <Input label="Phone Number" value={form.integrations?.twilio?.phoneNumber ?? ''} onChange={(e) => updateField('integrations.twilio.phoneNumber', e.target.value)} placeholder="+1234567890" />

          <FieldGroup label="Send Test SMS">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input label="Recipient Phone" value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+919876543210" />
              </div>
              <Button variant="outline" onClick={() => testSms.mutate({ phoneNumber: testPhone })} loading={testSms.isPending} disabled={!testPhone}>
                <Send className="h-4 w-4" /> Send Test
              </Button>
            </div>
          </FieldGroup>
        </div>
      </SectionCard>

      {/* SMTP Email */}
      <SectionCard
        title="SMTP Email"
        description="Email provider for OTP, password resets, and admin notifications."
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">SMTP Email</p>
                <StatusDot active={!!form.integrations?.smtp?.enabled} />
              </div>
            </div>
            <Toggle checked={!!form.integrations?.smtp?.enabled} onChange={(v) => updateField('integrations.smtp.enabled', v)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="SMTP Host" value={form.integrations?.smtp?.host ?? ''} onChange={(e) => updateField('integrations.smtp.host', e.target.value)} placeholder="smtp.gmail.com" />
            <Input label="Port" type="number" value={form.integrations?.smtp?.port ?? 587} onChange={(e) => updateField('integrations.smtp.port', Number(e.target.value))} />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!form.integrations?.smtp?.secure} onChange={(e) => updateField('integrations.smtp.secure', e.target.checked)} className="h-4 w-4 rounded border-zinc-200 text-primary focus:ring-primary" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Use SSL/TLS<HelpTip text="Enable for port 465. Disable for port 587 with STARTTLS." /></span>
              </label>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Username" value={form.integrations?.smtp?.user ?? ''} onChange={(e) => updateField('integrations.smtp.user', e.target.value)} placeholder="user@gmail.com" />
            <PasswordInput label="Password" value={form.integrations?.smtp?.pass ?? ''} onChange={(v) => updateField('integrations.smtp.pass', v)} placeholder="App password or SMTP password" />
          </div>
          <Input label="From Email" type="email" value={form.integrations?.smtp?.fromEmail ?? ''} onChange={(e) => updateField('integrations.smtp.fromEmail', e.target.value)} placeholder="noreply@example.com" />

          <FieldGroup label="Send Test Email">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input label="Recipient Email" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" />
              </div>
              <Button variant="outline" onClick={() => testSmtp.mutate({ email: testEmail })} loading={testSmtp.isPending} disabled={!testEmail}>
                <Send className="h-4 w-4" /> Send Test
              </Button>
            </div>
          </FieldGroup>
        </div>
      </SectionCard>
      {/* Cloudinary */}
      <SectionCard
        title="Cloudinary"
        description="Cloud-based image and video storage for ad media uploads."
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Cloudinary</p>
                <StatusDot active={!!form.integrations?.cloudinary?.enabled} />
              </div>
            </div>
            <Toggle checked={!!form.integrations?.cloudinary?.enabled} onChange={(v) => updateField('integrations.cloudinary.enabled', v)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Cloud Name" value={form.integrations?.cloudinary?.cloudName ?? ''} onChange={(e) => updateField('integrations.cloudinary.cloudName', e.target.value)} placeholder="your-cloud-name" />
            <Input label="API Key" value={form.integrations?.cloudinary?.apiKey ?? ''} onChange={(e) => updateField('integrations.cloudinary.apiKey', e.target.value)} placeholder="123456789012345" />
          </div>
          <PasswordInput label="API Secret" value={form.integrations?.cloudinary?.apiSecret ?? ''} onChange={(v) => updateField('integrations.cloudinary.apiSecret', v)} placeholder="Your Cloudinary API secret" />
        </div>
      </SectionCard>
    </div>
  );

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    features: renderFeatures,
    settings: renderAppSettings,
    maintenance: renderMaintenance,
    branding: renderBranding,
    content: renderContent,
    announcements: renderAnnouncements,
    advertisements: renderAdvertisements,
    integrations: renderIntegrations,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h2>
          {form.version != null && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Config version <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">v{form.version}</span>
            </p>
          )}
        </div>
        <Can permission="settings.update" fallback={<span className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800">Read-only</span>}>
          <Button onClick={handleSave} loading={updateConfig.isPending}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </Can>
      </div>

      {/* Layout: sidebar + content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar navigation */}
        <nav className="w-full shrink-0 lg:w-56">
          <div className="sticky top-6 space-y-1 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-zinc-400 dark:text-zinc-500')} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content area */}
        <div className="min-w-0 flex-1">
          {/* Section header */}
          {(() => {
            const sec = SECTIONS.find((s) => s.key === activeSection);
            if (!sec) return null;
            const Icon = sec.icon;
            return (
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{sec.label}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{sec.description}</p>
                </div>
              </div>
            );
          })()}

          {sectionRenderers[activeSection]?.()}
        </div>
      </div>
    </div>
  );
}
