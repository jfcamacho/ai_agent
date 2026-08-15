import { Injectable, Logger } from '@nestjs/common';
import { Company } from '../../../companies/domain/entities/company.entity';
import { IcpConfig } from '../../../icp-config/domain/entities/icp-config.entity';
import { IAgentServicePort } from '../../domain/ports/agent-service.port';

@Injectable()
export class AgentServiceHttpAdapter implements IAgentServicePort {
  private readonly logger = new Logger(AgentServiceHttpAdapter.name);
  private readonly agentUrl: string;

  constructor() {
    this.agentUrl = process.env.AGENT_SERVICE_URL || 'http://localhost:8081';
  }

  async discoverCandidates(icp: IcpConfig, maxResults = 10, sectorFilter?: string): Promise<Company[]> {
    try {
      const res = await fetch(`${this.agentUrl}/agent/discovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icp, maxResults, sectorFilter }),
      });

      if (!res.ok) {
        throw new Error(`Agent service responded with status ${res.status}`);
      }

      const data = await res.json();
      return (data.candidates || []).map((c: any) => new Company(c));
    } catch (error) {
      this.logger.error('Failed to communicate with Agent Service discovery:', error);
      throw error;
    }
  }

  async investigateCompany(payload: {
    name: string;
    domain: string;
    industry?: string;
    customContext?: string;
    icp: IcpConfig;
  }): Promise<Company> {
    try {
      const res = await fetch(`${this.agentUrl}/agent/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Agent service responded with status ${res.status}`);
      }

      const data = await res.json();
      return new Company(data.candidate);
    } catch (error) {
      this.logger.error('Failed to investigate custom company with Agent Service:', error);
      throw error;
    }
  }

  async enrichCompany(company: Company): Promise<Company> {
    try {
      const res = await fetch(`${this.agentUrl}/agent/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      });

      const data = await res.json();
      return new Company(data.company || company);
    } catch (error) {
      this.logger.error('Failed to enrich company with Agent Service:', error);
      return company;
    }
  }

  async scoreCompany(company: Company, icp: IcpConfig): Promise<any> {
    try {
      const res = await fetch(`${this.agentUrl}/agent/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, icp }),
      });

      const data = await res.json();
      return data.scoring;
    } catch (error) {
      this.logger.error('Failed to score company with Agent Service:', error);
      throw error;
    }
  }

  async generateOutreachDraft(payload: {
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
  }> {
    try {
      const res = await fetch(`${this.agentUrl}/agent/generate-outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data.draft;
    } catch (error) {
      this.logger.error('Failed to generate outreach draft with Agent Service:', error);
      throw error;
    }
  }

  async triageResponse(payload: {
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
  }> {
    try {
      const res = await fetch(`${this.agentUrl}/agent/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      return data.result;
    } catch (error) {
      this.logger.error('Failed to triage response with Agent Service:', error);
      throw error;
    }
  }
}
