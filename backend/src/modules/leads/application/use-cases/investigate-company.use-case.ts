import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_REPOSITORY_TOKEN, ICompanyRepositoryPort } from '../../../companies/domain/ports/company-repository.port';
import { ICP_CONFIG_REPOSITORY_TOKEN, IIcpConfigRepositoryPort } from '../../../icp-config/domain/ports/icp-config-repository.port';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadStatus, RecommendationBadge } from '../../domain/enums/lead-status.enum';
import { AGENT_SERVICE_PORT_TOKEN, IAgentServicePort } from '../../domain/ports/agent-service.port';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../domain/ports/lead-repository.port';

@Injectable()
export class InvestigateCompanyUseCase {
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

  async execute(input: {
    name: string;
    domain: string;
    industry?: string;
    customContext?: string;
  }): Promise<Lead> {
    const activeIcp = await this.icpConfigRepo.getActiveConfig();
    const company = await this.agentService.investigateCompany({
      ...input,
      icp: activeIcp,
    });

    await this.companyRepo.save(company);

    const scoring = (company as any).scoring;

    let lead = await this.leadRepo.findByCompanyId(company.id);

    if (!lead) {
      lead = new Lead({
        id: `lead_${company.id}`,
        companyId: company.id,
        companyName: company.name,
        domain: company.domain,
        industry: company.industry,
        businessModel: company.businessModel,
        insuranceAffinityCategory: company.insuranceAffinityCategory,
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
          overallJustification: 'Prospecto investigado a solicitud del Hunter.',
          evaluatedAt: new Date().toISOString(),
          evaluatorVersion: '2.0.0',
        },
        primaryContact: company.decisionMakers && company.decisionMakers.length > 0 ? company.decisionMakers[0] : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyDetails: company,
      });
    } else {
      if (scoring) {
        lead.evaluation = scoring;
      }
      lead.companyDetails = company;
      lead.updatedAt = new Date().toISOString();
    }

    await this.leadRepo.save(lead);
    return lead;
  }
}
