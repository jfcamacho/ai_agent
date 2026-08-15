import { Inject, Injectable } from '@nestjs/common';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AUDIT_REPOSITORY_TOKEN, IAuditRepositoryPort } from '../../domain/ports/audit-repository.port';

@Injectable()
export class RecordAuditLogUseCase {
  constructor(
    @Inject(AUDIT_REPOSITORY_TOKEN)
    private readonly auditRepo: IAuditRepositoryPort,
  ) {}

  async execute(logData: Partial<AuditLog>): Promise<AuditLog> {
    return this.auditRepo.record(logData);
  }
}
