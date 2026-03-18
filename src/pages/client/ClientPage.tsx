import { useState, useEffect } from 'react';
import { useClient, useUpdateClient } from '../../hooks/use-client';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { CheckCircle, Circle } from 'lucide-react';

export default function ClientPage() {
  const { data: client, isLoading } = useClient();
  const updateClient = useUpdateClient();

  const [form, setForm] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    industry: '',
    country: '',
    timezone: '',
  });

  useEffect(() => {
    if (client) {
      setForm({
        companyName: client.companyName ?? '',
        contactEmail: client.contactEmail ?? '',
        contactPhone: client.contactPhone ?? '',
        industry: client.industry ?? '',
        country: client.country ?? '',
        timezone: client.timezone ?? '',
      });
    }
  }, [client]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClient.mutate(form);
  };

  const onboarding = client?.onboarding;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Client Settings</h2>

      {onboarding && (
        <Card title="Onboarding Progress" className="mb-6">
          <div className="space-y-2">
            {Object.entries(onboarding).map(([step, done]) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                {done ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
                <span className={done ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
                  {step.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Company Information">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            <Input label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <Input label="Timezone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={updateClient.isPending}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
