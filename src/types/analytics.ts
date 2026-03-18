export interface TrendPoint { date: string; count: number; }
export interface TrendsData {
  users: TrendPoint[];
  matches: TrendPoint[];
  rooms: TrendPoint[];
  sportPopularity: { sport: string; count: number }[];
}

export interface EngagementData {
  activeUsers: number;
  matchesPerUser: number;
  avgSessionDuration?: number;
}

export interface GrowthData {
  userGrowth: { current: number; previous: number; rate: number };
  matchGrowth: { current: number; previous: number; rate: number };
}

export interface RevenueData {
  totalRevenue: number;
  currency: string;
  payments: { amount: number; date: string; method?: string }[];
}

export interface PlatformSummary {
  totalUsers: number;
  totalMatches: number;
  totalRooms: number;
  totalSportTypes: number;
}
