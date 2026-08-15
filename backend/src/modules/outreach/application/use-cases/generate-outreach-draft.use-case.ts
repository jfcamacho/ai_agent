import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { COMPANY_REPOSITORY_TOKEN, ICompanyRepositoryPort } from '../../../companies/domain/ports/company-repository.port';
import { AGENT_SERVICE_PORT_TOKEN, IAgentServicePort } from '../../../leads/domain/ports/agent-service.port';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../../leads/domain/ports/lead-repository.port';
import { LeadStatus } from '../../../leads/domain/enums/lead-status.enum';
import { OutreachMessage, OutreachStatus } from '../../domain/entities/outreach-message.entity';
import { IOutreachRepositoryPort, OUTREACH_REPOSITORY_TOKEN } from '../../domain/ports/outreach-repository.port';

@Injectable()
export class GenerateOutreachDraftUseCase {
  constructor(
    @Inject(OUTREACH_REPOSITORY_TOKEN)
    private readonly outreachRepo: IOutreachRepositoryPort,
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepo: ICompanyRepositoryPort,
    @Inject(AGENT_SERVICE_PORT_TOKEN)
    private readonly agentService: IAgentServicePort,
  ) {}

  async execute(payload: {
    leadId: string;
    hunterName?: string;
    hunterRole?: string;
    channel?: 'EMAIL' | 'LINKEDIN';
  }): Promise<OutreachMessage> {
    const lead = await this.leadRepo.findById(payload.leadId);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${payload.leadId} not found`);
    }

    const company = await this.companyRepo.findById(lead.companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${lead.companyId} not found`);
    }

    const targetContact = lead.primaryContact || (company.decisionMakers && company.decisionMakers[0]) || {
      name: 'Director de Alianzas',
      role: 'Head of Partnerships',
      email: `alianzas@${company.domain}`,
      confidenceScore: 0.8
    };

    const hunterName = payload.hunterName || 'Hunter Alianzas';
    const hunterRole = payload.hunterRole || 'Director de Alianzas Estratégicas';

    const draftResult = await this.agentService.generateOutreachDraft({
      company,
      targetContact,
      hunterName,
      hunterRole
    });

    const message = new OutreachMessage({
      id: `msg_${Date.now()}_${company.id}`,
      leadId: lead.id,
      companyId: company.id,
      companyName: company.name,
      recipientName: targetContact.name,
      recipientEmail: targetContact.email || `contacto@${company.domain}`,
      recipientRole: targetContact.role,
      channel: payload.channel || 'EMAIL',
      subject: draftResult.subject,
      body: draftResult.body,
      valueProposition: draftResult.valueProposition,
      hookRationale: draftResult.hookRationale,
      factsUtilized: draftResult.factsUtilized,
      guardrailsVerified: draftResult.guardrailsVerified,
      status: OutreachStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await this.outreachRepo.save(message);

    lead.status = LeadStatus.OUTREACH_GENERATED;
    lead.updatedAt = new Date().toISOString();
    await this.leadRepo.save(lead);

    return message;
  }
}
