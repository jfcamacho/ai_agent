import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IntegrationConfig } from '../../domain/entities/integration-config.entity';
import { IIntegrationRepositoryPort, INTEGRATION_REPOSITORY_TOKEN } from '../../domain/ports/integration-repository.port';

@Injectable()
export class SaveIntegrationUseCase {
  constructor(
    @Inject(INTEGRATION_REPOSITORY_TOKEN)
    private readonly integrationRepo: IIntegrationRepositoryPort,
  ) {}

  async execute(id: string, payload: Partial<IntegrationConfig>): Promise<IntegrationConfig> {
    let config = await this.integrationRepo.findById(id);
    if (!config) {
      throw new NotFoundException(`Integration with ID ${id} not found`);
    }

    config = new IntegrationConfig({
      ...config,
      ...payload,
      id,
    });

    if (config.apiKey && config.apiKey.trim().length > 0) {
      config.status = 'ACTIVE';
    } else {
      config.status = config.isEnabled ? 'SANDBOX_MOCK' : 'INACTIVE';
    }

    return this.integrationRepo.save(config);
  }
}
