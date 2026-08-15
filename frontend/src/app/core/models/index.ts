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

export interface ScoringDimension {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  reasoning: string;
}

export interface LeadEvaluation {
  totalScore: number;
  recommendation: 'PRIORITIZE' | 'REVIEW' | 'DISCARD';
  icpFit: ScoringDimension;
  b2b2cPotential: ScoringDimension;
  channelReadiness: ScoringDimension;
  marketPresence: ScoringDimension;
  positiveSignals: string[];
  riskWarnings: string[];
  overallJustification: string;
  evaluatedAt: string;
  evaluatorVersion: string;
}

export interface Company {
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
  discoverySource: string;
  discoveredAt: string;
}

export interface Lead {
  id: string;
  companyId: string;
  companyName: string;
  domain: string;
  industry: string;
  businessModel: string;
  insuranceAffinityCategory: string;
  status:
    | 'DISCOVERED'
    | 'ENRICHED'
    | 'APPROVED_BY_HUNTER'
    | 'REJECTED_BY_HUNTER'
    | 'OUTREACH_GENERATED'
    | 'CONTACTED'
    | 'POSITIVE_REPLY'
    | 'MEETING_SCHEDULED'
    | 'OPT_OUT_HALTED'
    | 'DISCARDED';
  evaluation: LeadEvaluation;
  primaryContact?: DecisionMaker;
  hunterDecision?: {
    action: 'APPROVED' | 'REJECTED';
    decidedBy: string;
    decidedAt: string;
    reason?: string;
  };
  createdAt: string;
  updatedAt: string;
  companyDetails?: Company;
}

export interface OutreachMessage {
  id: string;
  leadId: string;
  companyId: string;
  companyName: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  channel: 'EMAIL' | 'LINKEDIN';
  subject: string;
  body: string;
  valueProposition: string;
  hookRationale: string;
  factsUtilized: string[];
  guardrailsVerified: boolean;
  status: 'DRAFT' | 'APPROVED_PENDING_SEND' | 'SENT_SANDBOX' | 'SENT_LIVE' | 'FAILED';
  hunterApproval?: {
    approvedBy: string;
    approvedAt: string;
    editsMade: boolean;
  };
  sentAt?: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  companyId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  hunterName: string;
  hunterEmail: string;
  meetingDate: string;
  meetingTime: string;
  durationMinutes: number;
  meetingLink: string;
  agendaSummary: string;
  crmSyncStatus: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'RESCHEDULED' | 'CANCELLED';
  createdAt: string;
}

export interface IcpConfig {
  id: string;
  version: number;
  targetIndustries: string[];
  targetCompanySizes: string[];
  targetLocations: string[];
  targetDecisionMakerRoles: string[];
  excludedKeywords: string[];
  blacklistedDomains: string[];
  minimumScoreThreshold: number;
  autoApproveThreshold: number;
  weights: {
    icpFit: number;
    b2b2cPotential: number;
    channelReadiness: number;
    marketPresence: number;
  };
  isActive: boolean;
  updatedAt: string;
}

export interface BaselineComparison {
  metricName: string;
  baselineManual: number | string;
  pilotWithAi: number | string;
  deltaPercentage: string;
  interpretation: string;
}

export interface DashboardMetrics {
  totalDiscoveredCompanies: number;
  totalPrioritizedLeads: number;
  totalReviewedLeads: number;
  totalApprovedLeads: number;
  totalRejectedLeads: number;
  approvalRatePercentage: number;
  totalMessagesSentSandbox: number;
  totalPositiveResponses: number;
  totalOptOutsHalted: number;
  totalQualifiedAppointments: number;
  estimatedHoursSaved: number;
  estimatedCostPerLead: number;
  guardrailsComplianceRate: number;
  baselineComparison: BaselineComparison[];
  calculatedAt: string;
}

export interface VirtualOutboxRecord {
  id: string;
  messageId: string;
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  subject: string;
  renderedHtmlBody: string;
  deliveredAt: string;
  status: 'DELIVERED_VIRTUAL_SANDBOX' | 'OPENED_SIMULATED';
}

export interface AuditLog {
  id: string;
  eventType: string;
  entityId: string;
  performedBy: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface IntegrationConfig {
  id: string;
  provider: 'APOLLO_IO' | 'LINKEDIN_PROXYCURL' | 'HUNTER_IO' | 'DROPCONTACT' | 'CUSTOM_WEBHOOK';
  name: string;
  description: string;
  category: 'PEOPLE_ENRICHMENT' | 'EMAIL_VERIFICATION' | 'COMPANY_DATA' | 'WEBHOOK';
  apiKey?: string;
  apiSecret?: string;
  endpointUrl?: string;
  isEnabled: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SANDBOX_MOCK' | 'ERROR';
  rateLimitRemaining?: number;
  lastTestedAt?: string;
  testMessage?: string;
  featuresSupported: string[];
}

export interface PeopleSearchResult {
  name: string;
  role: string;
  department: string;
  linkedinUrl?: string;
  googleXrayUrl?: string;
  companyDirectoryUrl?: string;
  email?: string;
  confidenceScore: number;
  isVerified: boolean;
  sourceProvider: string;
  headline?: string;
  location?: string;
  seniority?: string;
}
