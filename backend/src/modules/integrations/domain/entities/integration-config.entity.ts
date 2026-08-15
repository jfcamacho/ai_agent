export type IntegrationProvider = 
  | 'APOLLO_IO' 
  | 'LINKEDIN_PROXYCURL' 
  | 'HUNTER_IO' 
  | 'DROPCONTACT' 
  | 'CUSTOM_WEBHOOK';

export type IntegrationStatus = 'ACTIVE' | 'INACTIVE' | 'SANDBOX_MOCK' | 'ERROR';

export class IntegrationConfig {
  id: string;
  provider: IntegrationProvider;
  name: string;
  description: string;
  category: 'PEOPLE_ENRICHMENT' | 'EMAIL_VERIFICATION' | 'COMPANY_DATA' | 'WEBHOOK';
  apiKey?: string;
  apiSecret?: string;
  endpointUrl?: string;
  isEnabled: boolean;
  status: IntegrationStatus;
  rateLimitRemaining?: number;
  lastTestedAt?: string;
  testMessage?: string;
  featuresSupported: string[];

  constructor(partial: Partial<IntegrationConfig>) {
    this.id = partial.id || '';
    this.provider = partial.provider || 'APOLLO_IO';
    this.name = partial.name || '';
    this.description = partial.description || '';
    this.category = partial.category || 'PEOPLE_ENRICHMENT';
    this.apiKey = partial.apiKey;
    this.apiSecret = partial.apiSecret;
    this.endpointUrl = partial.endpointUrl;
    this.isEnabled = partial.isEnabled ?? false;
    this.status = partial.status || 'SANDBOX_MOCK';
    this.rateLimitRemaining = partial.rateLimitRemaining ?? 1000;
    this.lastTestedAt = partial.lastTestedAt;
    this.testMessage = partial.testMessage;
    this.featuresSupported = partial.featuresSupported || [];
  }
}
