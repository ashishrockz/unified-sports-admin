export interface User {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'banned';
  friendsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type BulkAction = 'ban' | 'unban' | 'activate' | 'deactivate';
