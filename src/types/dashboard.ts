export interface AdminDashboard {
  users: { total: number; active: number; inactive: number; banned: number };
}

export interface SuperAdminDashboard {
  users: { total: number; active: number; inactive: number; banned: number };
  admins: { total: number; active: number; inactive: number };
  rooms?: { total: number; active: number; completed: number };
  matches?: { total: number; active: number; completed: number };
  sportTypes?: number;
}
