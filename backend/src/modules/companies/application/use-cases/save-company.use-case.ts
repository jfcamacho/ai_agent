import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY_TOKEN, ICompanyRepositoryPort } from '../../domain/ports/company-repository.port';

@Injectable()
export class SaveCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepo: ICompanyRepositoryPort,
  ) {}

  async execute(companyData: Partial<Company>): Promise<Company> {
    const id = companyData.id || `comp_${Date.now()}`;
    const company = new Company({
      ...companyData,
      id,
      updatedAt: new Date().toISOString()
    });
    return this.companyRepo.save(company);
  }
}
