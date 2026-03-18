export interface SportType {
  _id: string;
  name: string;
  slug: string;
  sport: string;
  description?: string;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
