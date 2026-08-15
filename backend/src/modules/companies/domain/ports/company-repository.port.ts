import { Company } from '../entities/company.entity';

export const COMPANY_REPOSITORY_TOKEN = 'COMPANY_REPOSITORY_PORT';

export interface ICompanyRepositoryPort {
  findAll(): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  findByDomain(domain: string): Promise<Company | null>;
  save(company: Company): Promise<Company>;
  saveBatch(companies: Company[]): Promise<Company[]>;
  delete(id: string): Promise<void>;
}
