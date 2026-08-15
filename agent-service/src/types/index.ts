export interface IcpCriteria {
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
}

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

export interface ScoringBreakdown {
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

export interface CompanyCandidate {
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
  insuranceAffinityCategory: 'EMBEDDED_INSURANCE' | 'PAYROLL_BENEFITS' | 'DEVICE_PROTECTION' | 'GIG_ECONOMY_PROTECTION' | 'SME_COMMERCIAL';
  decisionMakers: DecisionMaker[];
  signals: BusinessSignal[];
  sources: { name: string; url: string; retrievedAt: string }[];
  scoring?: ScoringBreakdown;
  discoverySource: 'AUTONOMOUS_PROACTIVE' | 'CSV_IMPORT' | 'MANUAL_REFERRAL' | 'CRM_SYNC';
  discoveredAt: string;
}

export interface OutreachDraftRequest {
  company: CompanyCandidate;
  targetContact: DecisionMaker;
  hunterName: string;
  hunterRole: string;
  productFocus?: string;
  customNotes?: string;
}

export interface OutreachDraftResult {
  subject: string;
  body: string;
  valueProposition: string;
  hookRationale: string;
  factsUtilized: string[];
  guardrailsVerified: boolean;
  channel: 'EMAIL' | 'LINKEDIN';
  generatedAt: string;
}

export interface TriageRequest {
  companyName: string;
  contactName: string;
  originalMessage: string;
  prospectReply: string;
}

export interface TriageResult {
  sentiment: 'POSITIVE_INTEREST' | 'OBJECTION' | 'AMBIGUOUS_SENSITIVE' | 'OPT_OUT_UNSUBSCRIBE' | 'OUT_OF_OFFICE';
  confidence: number;
  analysis: string;
  detectedIntent: string;
  recommendedNextAction: 'SCHEDULE_MEETING' | 'ESCALATE_TO_HUNTER' | 'HALT_CADENCE_AND_BLOCK' | 'RETRY_LATER';
  optOutRequested: boolean;
  proposedTimeSlots?: { date: string; time: string; durationMinutes: number }[];
  classifiedAt: string;
}
