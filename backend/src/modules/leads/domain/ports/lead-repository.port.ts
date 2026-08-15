import { Lead } from '../entities/lead.entity';
import { LeadStatus } from '../enums/lead-status.enum';

export const LEAD_REPOSITORY_TOKEN = 'LEAD_REPOSITORY_PORT';

export interface ILeadRepositoryPort {
  findAll(): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  findByStatus(status: LeadStatus): Promise<Lead[]>;
  findByCompanyId(companyId: string): Promise<Lead | null>;
  save(lead: Lead): Promise<Lead>;
  saveBatch(leads: Lead[]): Promise<Lead[]>;
  delete(id: string): Promise<void>;
}
