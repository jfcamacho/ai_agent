import { IntegrationConfig } from '../entities/integration-config.entity';

export const INTEGRATION_REPOSITORY_TOKEN = 'INTEGRATION_REPOSITORY';

export interface IIntegrationRepositoryPort {
  findAll(): Promise<IntegrationConfig[]>;
  findById(id: string): Promise<IntegrationConfig | null>;
  findByProvider(provider: string): Promise<IntegrationConfig | null>;
  save(config: IntegrationConfig): Promise<IntegrationConfig>;
}
