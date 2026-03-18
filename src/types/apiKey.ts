export interface ApiKey {
  _id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  rateLimit: number;
  status: 'active' | 'revoked';
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions?: string[];
  rateLimit?: number;
  expiresAt?: string;
}
