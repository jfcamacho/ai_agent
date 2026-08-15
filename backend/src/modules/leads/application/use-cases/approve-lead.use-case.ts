import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../domain/ports/lead-repository.port';

@Injectable()
export class ApproveLeadUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
  ) {}

  async execute(leadId: string, hunterName = 'Hunter Inter.mx', reason?: string): Promise<Lead> {
    const lead = await this.leadRepo.findById(leadId);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    lead.status = LeadStatus.APPROVED_BY_HUNTER;
    lead.hunterDecision = {
      action: 'APPROVED',
      decidedBy: hunterName,
      decidedAt: new Date().toISOString(),
      reason: reason || 'Aprobado por el Hunter para generación y revisión de mensaje.'
    };
    lead.updatedAt = new Date().toISOString();

    return this.leadRepo.save(lead);
  }
}
