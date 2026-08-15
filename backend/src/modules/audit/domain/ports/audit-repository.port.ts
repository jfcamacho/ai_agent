import { AuditLog } from '../entities/audit-log.entity';

export const AUDIT_REPOSITORY_TOKEN = 'AUDIT_REPOSITORY_PORT';

export interface IAuditRepositoryPort {
  record(log: Partial<AuditLog>): Promise<AuditLog>;
  findAll(): Promise<AuditLog[]>;
  findByEntityId(entityId: string): Promise<AuditLog[]>;
}
