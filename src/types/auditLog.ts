export interface AuditLog {
  _id: string;
  actor: { _id: string; name: string; email: string } | string;
  action: string;
  targetModel: string;
  targetId: string;
  details: Record<string, any>;
  ip: string;
  createdAt: string;
}
