export interface DecisionMaker {
  name: string;
  role: string;
  department: string;
  linkedinUrl?: string;
  email?: string;
  confidenceScore: number;
  isVerified: boolean;
}

export interface BusinessSignal {
  type: string;
  title: string;
  description: string;
  dateObserved: string;
  sourceUrl: string;
  relevanceScore: number;
}

export class Company {
  id: string;
  name: string;
  legalName?: string;
  domain: string;
  website: string;
  industry: string;
  subIndustry?: string;
  headquarters: string;
  country: string;
  estimatedEmployees: number;
  estimatedUserBase?: string;
  businessModel: 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'SaaS';
  description: string;
  productsAndServices: string[];
  insuranceAffinityCategory: string;
  decisionMakers: DecisionMaker[];
  signals: BusinessSignal[];
  sources: { name: string; url: string; retrievedAt: string }[];
  discoverySource: 'AUTONOMOUS_PROACTIVE' | 'CSV_IMPORT' | 'MANUAL_REFERRAL' | 'CRM_SYNC';
  discoveredAt: string;
  updatedAt?: string;

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }
}
