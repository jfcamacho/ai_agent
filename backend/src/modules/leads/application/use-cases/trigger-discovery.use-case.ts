import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_REPOSITORY_TOKEN, ICompanyRepositoryPort } from '../../../companies/domain/ports/company-repository.port';
import { ICP_CONFIG_REPOSITORY_TOKEN, IIcpConfigRepositoryPort } from '../../../icp-config/domain/ports/icp-config-repository.port';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadStatus, RecommendationBadge } from '../../domain/enums/lead-status.enum';
import { AGENT_SERVICE_PORT_TOKEN, IAgentServicePort } from '../../domain/ports/agent-service.port';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../domain/ports/lead-repository.port';

@Injectable()
export class TriggerDiscoveryUseCase {
  constructor(
    @Inject(AGENT_SERVICE_PORT_TOKEN)
    private readonly agentService: IAgentServicePort,
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepo: ICompanyRepositoryPort,
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
    @Inject(ICP_CONFIG_REPOSITORY_TOKEN)
    private readonly icpConfigRepo: IIcpConfigRepositoryPort,
  ) {}

  async execute(maxResults = 10, sectorFilter?: string): Promise<{ discoveredCount: number; leads: Lead[] }> {
    const activeIcp = await this.icpConfigRepo.getActiveConfig();
    const discoveredCompanies = await this.agentService.discoverCandidates(activeIcp, maxResults, sectorFilter);

    const createdLeads: Lead[] = [];

    for (const compData of discoveredCompanies) {
      await this.companyRepo.save(compData);

      let lead = await this.leadRepo.findByCompanyId(compData.id);
      const scoring = (compData as any).scoring;

      if (!lead) {
        lead = new Lead({
          id: `lead_${compData.id}`,
          companyId: compData.id,
          companyName: compData.name,
          domain: compData.domain,
          industry: compData.industry,
          businessModel: compData.businessModel,
          insuranceAffinityCategory: compData.insuranceAffinityCategory,
          status: LeadStatus.DISCOVERED,
          evaluation: scoring || {
            totalScore: 70,
            recommendation: RecommendationBadge.REVIEW,
            icpFit: { name: 'Fit ICP', score: 20, maxScore: 30, weight: 0.3, reasoning: 'Alineado con industria' },
            b2b2cPotential: { name: 'Potencial B2B2C', score: 20, maxScore: 30, weight: 0.3, reasoning: 'Canal en análisis' },
            channelReadiness: { name: 'Madurez de Canal', score: 15, maxScore: 20, weight: 0.2, reasoning: 'Web activa' },
            marketPresence: { name: 'Presencia', score: 15, maxScore: 20, weight: 0.2, reasoning: 'Presencia nacional' },
            positiveSignals: [],
            riskWarnings: [],
            overallJustification: 'Prospecto detectado en búsqueda proactiva.',
            evaluatedAt: new Date().toISOString(),
            evaluatorVersion: '2.0.0'
          },
          primaryContact: compData.decisionMakers && compData.decisionMakers.length > 0 ? compData.decisionMakers[0] : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          companyDetails: compData
        });
      } else {
        if (scoring) {
          lead.evaluation = scoring;
        }
        lead.companyDetails = compData;
        lead.updatedAt = new Date().toISOString();
      }

      await this.leadRepo.save(lead);
      createdLeads.push(lead);
    }

    return {
      discoveredCount: createdLeads.length,
      leads: createdLeads
    };
  }
}
