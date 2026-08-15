import { Inject, Injectable, Logger } from '@nestjs/common';
import { IIntegrationRepositoryPort, INTEGRATION_REPOSITORY_TOKEN } from '../../domain/ports/integration-repository.port';

export interface PeopleSearchResult {
  name: string;
  role: string;
  department: string;
  linkedinUrl?: string;
  googleXrayUrl?: string;
  companyDirectoryUrl?: string;
  email?: string;
  confidenceScore: number;
  isVerified: boolean;
  sourceProvider: string;
  headline?: string;
  location?: string;
  seniority?: string;
}

@Injectable()
export class SearchPeopleUseCase {
  private readonly logger = new Logger(SearchPeopleUseCase.name);
  private readonly agentUrl: string;

  constructor(
    @Inject(INTEGRATION_REPOSITORY_TOKEN)
    private readonly integrationRepo: IIntegrationRepositoryPort,
  ) {
    this.agentUrl = process.env.AGENT_SERVICE_URL || 'http://localhost:8081';
  }

  async execute(payload: {
    companyName: string;
    domain?: string;
    personName?: string;
    roleOrDepartment?: string;
  }): Promise<{ count: number; people: PeopleSearchResult[]; providersQueried: string[] }> {
    const integrations = await this.integrationRepo.findAll();
    const enabledProviders = integrations.filter(i => i.isEnabled);

    const apollo = integrations.find(i => i.provider === 'APOLLO_IO' && i.isEnabled);
    const linkedin = integrations.find(i => i.provider === 'LINKEDIN_PROXYCURL' && i.isEnabled);
    const hunter = integrations.find(i => i.provider === 'HUNTER_IO' && i.isEnabled);

    const apiKeys = {
      apolloApiKey: apollo?.apiKey,
      linkedinApiKey: linkedin?.apiKey,
      hunterApiKey: hunter?.apiKey,
    };

    try {
      const res = await fetch(`${this.agentUrl}/agent/people-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: payload.companyName,
          domain: payload.domain || payload.companyName,
          personName: payload.personName,
          roleOrDepartment: payload.roleOrDepartment,
          apiKeys,
        }),
      });

      if (!res.ok) {
        throw new Error(`Agent service responded with status ${res.status}`);
      }

      const data = await res.json();

      return {
        count: data.people?.length || 0,
        people: data.people || [],
        providersQueried: enabledProviders.map(p => p.name),
      };
    } catch (error) {
      this.logger.error('Failed to search people with Agent Service:', error);
      throw error;
    }
  }
}
