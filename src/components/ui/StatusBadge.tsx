import Badge from './Badge';

const statusMap: Record<string, { variant: string; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'neutral', label: 'Inactive' },
  banned: { variant: 'danger', label: 'Banned' },
  waiting: { variant: 'info', label: 'Waiting' },
  toss_pending: { variant: 'warning', label: 'Toss Pending' },
  completed: { variant: 'success', label: 'Completed' },
  abandoned: { variant: 'danger', label: 'Abandoned' },
  not_started: { variant: 'neutral', label: 'Not Started' },
  innings_break: { variant: 'info', label: 'Innings Break' },
  set_break: { variant: 'info', label: 'Set Break' },
  trial: { variant: 'warning', label: 'Trial' },
  past_due: { variant: 'danger', label: 'Past Due' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
  expired: { variant: 'danger', label: 'Expired' },
  revoked: { variant: 'danger', label: 'Revoked' },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] || { variant: 'neutral', label: status };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
