export interface Admin {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'superadmin';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}
