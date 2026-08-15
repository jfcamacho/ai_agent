import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY_TOKEN, ICompanyRepositoryPort } from '../../domain/ports/company-repository.port';

@Injectable()
export class GetCompanyDossierUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepo: ICompanyRepositoryPort,
  ) {}

  async execute(companyId: string): Promise<Company> {
    const company = await this.companyRepo.findById(companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
    return company;
  }
}
