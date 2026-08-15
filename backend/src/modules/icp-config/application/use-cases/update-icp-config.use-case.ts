import { Inject, Injectable } from '@nestjs/common';
import { IcpConfig } from '../../domain/entities/icp-config.entity';
import { ICP_CONFIG_REPOSITORY_TOKEN, IIcpConfigRepositoryPort } from '../../domain/ports/icp-config-repository.port';

@Injectable()
export class UpdateIcpConfigUseCase {
  constructor(
    @Inject(ICP_CONFIG_REPOSITORY_TOKEN)
    private readonly icpConfigRepo: IIcpConfigRepositoryPort,
  ) {}

  async execute(updatedData: Partial<IcpConfig>): Promise<IcpConfig> {
    const current = await this.icpConfigRepo.getActiveConfig();
    const newVersion = (current.version || 1) + 1;

    const updatedConfig = new IcpConfig({
      ...current,
      ...updatedData,
      version: newVersion,
      updatedAt: new Date().toISOString()
    });

    return this.icpConfigRepo.save(updatedConfig);
  }
}
