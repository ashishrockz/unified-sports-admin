import { useSubscription, useUsage } from '../../hooks/use-subscription';
import { usePlans } from '../../hooks/use-subscription-plans';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import { formatDate, formatNumber } from '../../lib/utils';

export default function SubscriptionPage() {
  const { data: subscription, isLoading } = useSubscription();
  const { data: usage } = useUsage();
  const { data: plansData } = usePlans();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const plans = plansData?.data ?? [];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Subscription</h2>

      {subscription && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <Card title="Current Plan">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={subscription.status} />
                <span className="text-sm text-gray-500 capitalize">{subscription.billingCycle} billing</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Period: {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</p>
                {subscription.trialEndsAt && <p>Trial ends: {formatDate(subscription.trialEndsAt)}</p>}
              </div>
            </div>
          </Card>

          {usage && (
            <Card title="Usage">
              <div className="space-y-3">
                <UsageBar label="Users" current={usage.currentUsers ?? 0} max={usage.maxUsers} />
                <UsageBar label="Matches/mo" current={usage.currentMatchesThisMonth ?? 0} max={usage.maxMatchesPerMonth} />
                <UsageBar label="Rooms/mo" current={usage.currentRoomsThisMonth ?? 0} max={usage.maxRoomsPerMonth} />
                <UsageBar label="Storage (MB)" current={usage.currentStorageMB ?? 0} max={usage.maxStorageMB} />
              </div>
            </Card>
          )}
        </div>
      )}

      {plans.length > 0 && (
        <>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Available Plans</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan: any) => (
              <div key={plan._id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{plan.displayName || plan.name}</h4>
                {plan.description && <p className="mt-1 text-sm text-gray-500">{plan.description}</p>}
                <div className="mt-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{plan.price?.currency} {formatNumber(plan.price?.monthly)}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Up to {formatNumber(plan.limits?.maxUsers)} users</li>
                  <li>{formatNumber(plan.limits?.maxMatchesPerMonth)} matches/month</li>
                  <li>{formatNumber(plan.limits?.maxStorageMB)} MB storage</li>
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UsageBar({ label, current, max }: { label: string; current: number; max?: number }) {
  const pct = max ? Math.min((current / max) * 100, 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-gray-100">{formatNumber(current)}{max ? ` / ${formatNumber(max)}` : ''}</span>
      </div>
      {max && (
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div className={`h-full rounded-full transition-all ${pct > 90 ? 'bg-danger' : pct > 70 ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
