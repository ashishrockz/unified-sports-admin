export interface Client {
  _id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  country: string;
  timezone: string;
  onboarding: {
    profileSetup: boolean;
    planSelected: boolean;
    brandingConfigured: boolean;
    sportTypesConfigured: boolean;
    firstAdminCreated: boolean;
    integrationsTested: boolean;
  };
  whiteLabel: {
    enabled: boolean;
    customDomain: string;
    favicon: string;
    loginLogo: string;
    emailTemplate: { headerColor: string; footerText: string; logoUrl: string };
  };
}
