import { useState, useEffect } from 'react';
import { useAppConfig, useUpdateAppConfig, useTestSms, useTestSmtp } from '../../hooks/use-app-config';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import Spinner from '../../components/ui/Spinner';
import Tabs from '../../components/ui/Tabs';

export default function AppConfigPage() {
  const { data: config, isLoading } = useAppConfig();
  const updateConfig = useUpdateAppConfig();
  const testSms = useTestSms();
  const testSmtp = useTestSmtp();

  const [activeTab, setActiveTab] = useState('features');
  const [form, setForm] = useState<Record<string, any>>({});
  const [testPhone, setTestPhone] = useState('');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

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

  const tabs = [
    { key: 'features', label: 'Features' },
    { key: 'maintenance', label: 'Maintenance' },
    { key: 'branding', label: 'Branding' },
    { key: 'content', label: 'Content' },
    { key: 'integrations', label: 'Integrations' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">App Configuration</h2>
        <Button onClick={handleSave} loading={updateConfig.isPending}>Save Changes</Button>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'features' && (
          <Card title="Feature Flags">
            <div className="space-y-4">
              {form.features && Object.entries(form.features).map(([key, val]) => (
                <Toggle key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} checked={!!val} onChange={(v) => updateField(`features.${key}`, v)} />
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'maintenance' && (
          <Card title="Maintenance Mode">
            <div className="space-y-4">
              <Toggle label="Enable Maintenance Mode" checked={!!form.maintenance?.enabled} onChange={(v) => updateField('maintenance.enabled', v)} />
              <Input label="Title" value={form.maintenance?.title ?? ''} onChange={(e) => updateField('maintenance.title', e.target.value)} />
              <Input label="Message" value={form.maintenance?.message ?? ''} onChange={(e) => updateField('maintenance.message', e.target.value)} />
            </div>
          </Card>
        )}

        {activeTab === 'branding' && (
          <Card title="App Branding">
            <div className="space-y-4">
              <Input label="App Name" value={form.branding?.appName ?? ''} onChange={(e) => updateField('branding.appName', e.target.value)} />
              <Input label="Tagline" value={form.branding?.tagline ?? ''} onChange={(e) => updateField('branding.tagline', e.target.value)} />
              <Input label="Primary Color" type="color" value={form.branding?.primaryColor ?? '#3b82f6'} onChange={(e) => updateField('branding.primaryColor', e.target.value)} />
              <Input label="Logo URL" value={form.branding?.logoUrl ?? ''} onChange={(e) => updateField('branding.logoUrl', e.target.value)} />
            </div>
          </Card>
        )}

        {activeTab === 'content' && (
          <Card title="Content & Links">
            <div className="space-y-4">
              <Input label="Terms URL" value={form.content?.termsUrl ?? ''} onChange={(e) => updateField('content.termsUrl', e.target.value)} />
              <Input label="Privacy URL" value={form.content?.privacyUrl ?? ''} onChange={(e) => updateField('content.privacyUrl', e.target.value)} />
              <Input label="Support Email" value={form.content?.supportEmail ?? ''} onChange={(e) => updateField('content.supportEmail', e.target.value)} />
            </div>
          </Card>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <Card title="Twilio SMS">
              <div className="space-y-4">
                <Toggle label="Enabled" checked={!!form.integrations?.twilio?.enabled} onChange={(v) => updateField('integrations.twilio.enabled', v)} />
                <Input label="Account SID" value={form.integrations?.twilio?.accountSid ?? ''} onChange={(e) => updateField('integrations.twilio.accountSid', e.target.value)} />
                <Input label="Auth Token" type="password" value={form.integrations?.twilio?.authToken ?? ''} onChange={(e) => updateField('integrations.twilio.authToken', e.target.value)} />
                <Input label="Phone Number" value={form.integrations?.twilio?.phoneNumber ?? ''} onChange={(e) => updateField('integrations.twilio.phoneNumber', e.target.value)} />
                <div className="flex items-end gap-3">
                  <Input label="Test Phone" value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+1234567890" />
                  <Button variant="outline" onClick={() => testSms.mutate({ phoneNumber: testPhone })} loading={testSms.isPending}>Test</Button>
                </div>
              </div>
            </Card>
            <Card title="SMTP Email">
              <div className="space-y-4">
                <Toggle label="Enabled" checked={!!form.integrations?.smtp?.enabled} onChange={(v) => updateField('integrations.smtp.enabled', v)} />
                <Input label="Host" value={form.integrations?.smtp?.host ?? ''} onChange={(e) => updateField('integrations.smtp.host', e.target.value)} />
                <Input label="Port" type="number" value={form.integrations?.smtp?.port ?? ''} onChange={(e) => updateField('integrations.smtp.port', Number(e.target.value))} />
                <Input label="User" value={form.integrations?.smtp?.user ?? ''} onChange={(e) => updateField('integrations.smtp.user', e.target.value)} />
                <Input label="Password" type="password" value={form.integrations?.smtp?.pass ?? ''} onChange={(e) => updateField('integrations.smtp.pass', e.target.value)} />
                <Input label="From Email" value={form.integrations?.smtp?.fromEmail ?? ''} onChange={(e) => updateField('integrations.smtp.fromEmail', e.target.value)} />
                <div className="flex items-end gap-3">
                  <Input label="Test Email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" />
                  <Button variant="outline" onClick={() => testSmtp.mutate({ email: testEmail })} loading={testSmtp.isPending}>Test</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
