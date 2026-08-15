import { Inject, Injectable } from '@nestjs/common';
import { IcpConfig } from '../../domain/entities/icp-config.entity';
import { ICP_CONFIG_REPOSITORY_TOKEN, IIcpConfigRepositoryPort } from '../../domain/ports/icp-config-repository.port';

@Injectable()
export class GetIcpConfigUseCase {
  constructor(
    @Inject(ICP_CONFIG_REPOSITORY_TOKEN)
    private readonly icpConfigRepo: IIcpConfigRepositoryPort,
  ) {}

  async execute(): Promise<IcpConfig> {
    return this.icpConfigRepo.getActiveConfig();
  }
}
