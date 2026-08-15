import { Inject, Injectable } from '@nestjs/common';
import { IntegrationConfig } from '../../domain/entities/integration-config.entity';
import { IIntegrationRepositoryPort, INTEGRATION_REPOSITORY_TOKEN } from '../../domain/ports/integration-repository.port';

@Injectable()
export class GetIntegrationsUseCase {
  constructor(
    @Inject(INTEGRATION_REPOSITORY_TOKEN)
    private readonly integrationRepo: IIntegrationRepositoryPort,
  ) {}

  async execute(): Promise<IntegrationConfig[]> {
    return this.integrationRepo.findAll();
  }
}
