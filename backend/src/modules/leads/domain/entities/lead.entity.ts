import { Company, DecisionMaker } from '../../../companies/domain/entities/company.entity';
import { LeadStatus, RecommendationBadge } from '../enums/lead-status.enum';

export interface ScoringDimension {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  reasoning: string;
}

export interface LeadEvaluation {
  totalScore: number;
  recommendation: RecommendationBadge;
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

export class Lead {
  id: string;
  companyId: string;
  companyName: string;
  domain: string;
  industry: string;
  businessModel: string;
  insuranceAffinityCategory: string;
  status: LeadStatus;
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

  constructor(partial: Partial<Lead>) {
    Object.assign(this, partial);
  }
}
