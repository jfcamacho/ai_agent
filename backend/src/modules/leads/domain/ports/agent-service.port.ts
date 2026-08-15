import { Company } from '../../../companies/domain/entities/company.entity';
import { IcpConfig } from '../../../icp-config/domain/entities/icp-config.entity';

export const AGENT_SERVICE_PORT_TOKEN = 'AGENT_SERVICE_PORT';

export interface IAgentServicePort {
  discoverCandidates(icp: IcpConfig, maxResults?: number, sectorFilter?: string): Promise<Company[]>;
  investigateCompany(payload: {
    name: string;
    domain: string;
    industry?: string;
    customContext?: string;
    icp: IcpConfig;
  }): Promise<Company>;
  enrichCompany(company: Company): Promise<Company>;
  scoreCompany(company: Company, icp: IcpConfig): Promise<any>;
  generateOutreachDraft(payload: {
    company: Company;
    targetContact: any;
    hunterName: string;
    hunterRole: string;
  }): Promise<{
    subject: string;
    body: string;
    valueProposition: string;
    hookRationale: string;
    factsUtilized: string[];
    guardrailsVerified: boolean;
  }>;
  triageResponse(payload: {
    companyName: string;
    contactName: string;
    originalMessage: string;
    prospectReply: string;
  }): Promise<{
    sentiment: string;
    confidence: number;
    analysis: string;
    detectedIntent: string;
    recommendedNextAction: string;
    optOutRequested: boolean;
    proposedTimeSlots?: { date: string; time: string; durationMinutes: number }[];
  }>;
}
