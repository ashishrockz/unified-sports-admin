import type { Role } from '../config/permissions';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: Role;
    status: string;
  };
}
