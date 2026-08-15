import { IcpConfig } from '../entities/icp-config.entity';

export const ICP_CONFIG_REPOSITORY_TOKEN = 'ICP_CONFIG_REPOSITORY_PORT';

export interface IIcpConfigRepositoryPort {
  getActiveConfig(): Promise<IcpConfig>;
  save(config: IcpConfig): Promise<IcpConfig>;
}
