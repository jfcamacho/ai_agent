import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY_TOKEN, ICompanyRepositoryPort } from '../../domain/ports/company-repository.port';

@Injectable()
export class GetCompaniesUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepo: ICompanyRepositoryPort,
  ) {}

  async execute(): Promise<Company[]> {
    return this.companyRepo.findAll();
  }
}
