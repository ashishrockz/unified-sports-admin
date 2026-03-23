export interface AppConfig {
  version: number;
  maintenance: {
    enabled: boolean;
    title: string;
    message: string;
    allowedRoles: string[];
    estimatedEndTime: string | null;
  };
  features: {
    leaderboard: boolean;
    friends: boolean;
    rooms: boolean;
    highlights: boolean;
    matchSharing: boolean;
    userSearch: boolean;
  };
  settings: {
    paginationLimit: number;
    roomListLimit: number;
    leaderboardLimit: number;
    commentaryLimit: number;
    maxOvers: number;
    minOvers: number;
    otpLength: number;
    otpResendSeconds: number;
    apiTimeoutMs: number;
    socketReconnectAttempts: number;
    socketReconnectDelayMs: number;
  };
  content: {
    termsUrl: string;
    privacyUrl: string;
    supportEmail: string;
    announcement: { enabled: boolean; title: string; message: string; type: string };
    forceUpdate: { enabled: boolean; minVersion: string; updateUrl: string; message: string };
  };
  branding: {
    appName: string;
    tagline: string;
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    splashScreen: {
      enabled: boolean;
      mediaType: 'image' | 'video';
      mediaUrl: string;
      durationSeconds: number;
      backgroundColor: string;
      showAppName: boolean;
      showTagline: boolean;
    };
  };
  advertisements: {
    enabled: boolean;
    placements: {
      splash: { enabled: boolean; mediaType: string; mediaUrl: string; linkUrl: string; sponsorName: string };
      homeBanner: { enabled: boolean; mediaType: string; mediaUrl: string; linkUrl: string; sponsorName: string };
      tossScreen: { enabled: boolean; logoUrl: string; sponsorName: string; tagline: string };
    };
  };
  integrations: {
    twilio: { enabled: boolean; accountSid: string; authToken: string; phoneNumber: string };
    smtp: { enabled: boolean; host: string; port: number; secure: boolean; user: string; pass: string; fromEmail: string };
  };
}
