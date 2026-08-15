import { OutreachMessage } from '../entities/outreach-message.entity';

export const OUTREACH_REPOSITORY_TOKEN = 'OUTREACH_REPOSITORY_PORT';

export interface IOutreachRepositoryPort {
  findAll(): Promise<OutreachMessage[]>;
  findById(id: string): Promise<OutreachMessage | null>;
  findByLeadId(leadId: string): Promise<OutreachMessage[]>;
  save(message: OutreachMessage): Promise<OutreachMessage>;
  delete(id: string): Promise<void>;
}
