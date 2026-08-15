import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AUDIT_REPOSITORY_TOKEN, IAuditRepositoryPort } from '../../../audit/domain/ports/audit-repository.port';
import { ICP_CONFIG_REPOSITORY_TOKEN, IIcpConfigRepositoryPort } from '../../../icp-config/domain/ports/icp-config-repository.port';
import { AGENT_SERVICE_PORT_TOKEN, IAgentServicePort } from '../../../leads/domain/ports/agent-service.port';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../../leads/domain/ports/lead-repository.port';
import { LeadStatus } from '../../../leads/domain/enums/lead-status.enum';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { TriageRecord } from '../../domain/entities/triage-result.entity';

@Injectable()
export class ProcessResponseUseCase {
  private readonly collectionName = 'triage_records';

  constructor(
    @Inject(AGENT_SERVICE_PORT_TOKEN)
    private readonly agentService: IAgentServicePort,
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
    @Inject(ICP_CONFIG_REPOSITORY_TOKEN)
    private readonly icpConfigRepo: IIcpConfigRepositoryPort,
    @Inject(AUDIT_REPOSITORY_TOKEN)
    private readonly auditRepo: IAuditRepositoryPort,
    private readonly firebaseService: FirebaseService,
  ) {}

  async execute(payload: {
    leadId: string;
    prospectReply: string;
    contactName?: string;
  }): Promise<TriageRecord> {
    const lead = await this.leadRepo.findById(payload.leadId);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${payload.leadId} not found`);
    }

    const contactName = payload.contactName || lead.primaryContact?.name || 'Prospecto';

    const triageResult = await this.agentService.triageResponse({
      companyName: lead.companyName,
      contactName,
      originalMessage: 'Propuesta de alianza B2B2C Inter.mx',
      prospectReply: payload.prospectReply,
    });

    const record = new TriageRecord({
      id: `triage_${Date.now()}`,
      leadId: lead.id,
      companyName: lead.companyName,
      contactName,
      prospectReply: payload.prospectReply,
      sentiment: triageResult.sentiment as any,
      confidence: triageResult.confidence,
      analysis: triageResult.analysis,
      detectedIntent: triageResult.detectedIntent,
      recommendedNextAction: triageResult.recommendedNextAction as any,
      optOutRequested: triageResult.optOutRequested,
      proposedTimeSlots: triageResult.proposedTimeSlots,
      triagedAt: new Date().toISOString(),
    });

    if (triageResult.optOutRequested) {
      lead.status = LeadStatus.OPT_OUT_HALTED;
      lead.updatedAt = new Date().toISOString();
      await this.leadRepo.save(lead);

      const icp = await this.icpConfigRepo.getActiveConfig();
      if (!icp.blacklistedDomains.includes(lead.domain)) {
        icp.blacklistedDomains.push(lead.domain);
        await this.icpConfigRepo.save(icp);
      }

      await this.auditRepo.record({
        eventType: 'GUARDRAIL_TRIGGERED_OPT_OUT',
        entityId: lead.id,
        performedBy: 'AI_AGENT_TRIAGE',
        details: {
          reason: 'Prospecto solicitó baja o no ser contactado.',
          domainBlacklisted: lead.domain,
          prospectReply: payload.prospectReply
        }
      });
    } else if (triageResult.sentiment === 'POSITIVE_INTEREST') {
      lead.status = LeadStatus.POSITIVE_REPLY;
      lead.updatedAt = new Date().toISOString();
      await this.leadRepo.save(lead);

      await this.auditRepo.record({
        eventType: 'POSITIVE_RESPONSE_DETECTED',
        entityId: lead.id,
        performedBy: 'AI_AGENT_TRIAGE',
        details: {
          intent: triageResult.detectedIntent,
          proposedSlots: triageResult.proposedTimeSlots
        }
      });
    } else {
      // Escalation / Objection / Ambiguous: Requires Human Hunter intervention
      lead.status = LeadStatus.CONTACTED;
      lead.updatedAt = new Date().toISOString();
      await this.leadRepo.save(lead);

      await this.auditRepo.record({
        eventType: 'HUMAN_ESCALATION_REQUIRED',
        entityId: lead.id,
        performedBy: 'AI_AGENT_TRIAGE',
        details: {
          reason: 'El prospecto respondió con dudas técnicas, objeción o condiciones comerciales complejas.',
          analysis: triageResult.analysis,
          prospectReply: payload.prospectReply,
          recommendedAction: 'El Hunter comercial debe tomar el control de la conversación y responder manualmente sin automatizaciones.'
        }
      });
    }

    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(record.id).set({ ...record });

    return record;
  }

  async getAll(): Promise<TriageRecord[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    return snap.docs.map(d => new TriageRecord({ id: d.id, ...d.data() }));
  }
}
