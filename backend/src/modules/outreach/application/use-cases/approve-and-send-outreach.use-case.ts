import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AUDIT_REPOSITORY_TOKEN, IAuditRepositoryPort } from '../../../audit/domain/ports/audit-repository.port';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../../leads/domain/ports/lead-repository.port';
import { LeadStatus } from '../../../leads/domain/enums/lead-status.enum';
import { GuardrailsValidator } from '../../../shared/guards/guardrails.validator';
import { OutreachMessage, OutreachStatus } from '../../domain/entities/outreach-message.entity';
import { IOutreachRepositoryPort, OUTREACH_REPOSITORY_TOKEN } from '../../domain/ports/outreach-repository.port';
import { IVirtualOutboxPort, VIRTUAL_OUTBOX_PORT_TOKEN } from '../../domain/ports/virtual-outbox.port';

@Injectable()
export class ApproveAndSendOutreachUseCase {
  constructor(
    @Inject(OUTREACH_REPOSITORY_TOKEN)
    private readonly outreachRepo: IOutreachRepositoryPort,
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
    @Inject(VIRTUAL_OUTBOX_PORT_TOKEN)
    private readonly virtualOutbox: IVirtualOutboxPort,
    @Inject(AUDIT_REPOSITORY_TOKEN)
    private readonly auditRepo: IAuditRepositoryPort,
    private readonly guardrailsValidator: GuardrailsValidator,
  ) {}

  async execute(payload: {
    messageId: string;
    approvedBy: string;
    editedSubject?: string;
    editedBody?: string;
  }): Promise<{ message: OutreachMessage; sandboxDelivery: any }> {
    const message = await this.outreachRepo.findById(payload.messageId);
    if (!message) {
      throw new NotFoundException(`Outreach message with ID ${payload.messageId} not found`);
    }

    const finalSubject = payload.editedSubject || message.subject;
    const finalBody = payload.editedBody || message.body;

    const validation = this.guardrailsValidator.validateOutreachMessage(finalSubject, finalBody);
    if (!validation.isValid) {
      throw new BadRequestException(`Guardrail Violation: ${validation.violations.join(', ')}`);
    }

    const editsMade = finalSubject !== message.subject || finalBody !== message.body;

    message.subject = finalSubject;
    message.body = finalBody;
    message.status = OutreachStatus.SENT_SANDBOX;
    message.hunterApproval = {
      approvedBy: payload.approvedBy,
      approvedAt: new Date().toISOString(),
      editsMade
    };
    message.sentAt = new Date().toISOString();
    message.updatedAt = new Date().toISOString();

    const sandboxRecord = await this.virtualOutbox.dispatchMessage(message);

    message.deliveryLog = {
      virtualId: sandboxRecord.id,
      simulatedStatus: sandboxRecord.status,
      timestamp: sandboxRecord.deliveredAt,
      recipientHost: `mx.${message.companyName.toLowerCase().replace(/\s+/g, '')}.com`
    };

    await this.outreachRepo.save(message);

    const lead = await this.leadRepo.findById(message.leadId);
    if (lead) {
      lead.status = LeadStatus.CONTACTED;
      lead.updatedAt = new Date().toISOString();
      await this.leadRepo.save(lead);
    }

    await this.auditRepo.record({
      eventType: 'OUTREACH_APPROVED_AND_SENT_SANDBOX',
      entityId: message.id,
      performedBy: payload.approvedBy,
      details: {
        leadId: message.leadId,
        companyName: message.companyName,
        recipientEmail: message.recipientEmail,
        subject: message.subject,
        editsMade,
        sandboxDeliveryId: sandboxRecord.id
      }
    });

    return {
      message,
      sandboxDelivery: sandboxRecord
    };
  }
}
