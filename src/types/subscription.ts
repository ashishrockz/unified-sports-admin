export interface Subscription {
  _id: string;
  planId: any;
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  paymentHistory: { amount: number; currency: string; date: string; method?: string; transactionId?: string }[];
  usage: {
    currentUsers: number;
    currentMatchesThisMonth: number;
    currentRoomsThisMonth: number;
    currentStorageMB: number;
    lastResetAt: string;
  };
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  price: { monthly: number; yearly: number; currency: string };
  limits: {
    maxUsers: number;
    maxMatchesPerMonth: number;
    maxRoomsPerMonth: number;
    maxStorageMB: number;
    maxAdmins: number;
    maxSportTypes: number;
  };
  features: {
    whiteLabeling: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    analytics: boolean;
    exportData: boolean;
    advertisements: boolean;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}
