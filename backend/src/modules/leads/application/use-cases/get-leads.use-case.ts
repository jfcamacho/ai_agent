import { Inject, Injectable } from '@nestjs/common';
import { Lead } from '../../domain/entities/lead.entity';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../domain/ports/lead-repository.port';

@Injectable()
export class GetLeadsUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
  ) {}

  async execute(): Promise<Lead[]> {
    return this.leadRepo.findAll();
  }
}
