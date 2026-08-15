import { Module } from '@nestjs/common';
import { FirebaseService } from '../shared/database/firebase.service';
import { GetAuditLogsUseCase } from './application/use-cases/get-audit-logs.use-case';
import { RecordAuditLogUseCase } from './application/use-cases/record-audit-log.use-case';
import { AUDIT_REPOSITORY_TOKEN } from './domain/ports/audit-repository.port';
import { AuditController } from './infrastructure/controllers/audit.controller';
import { FirestoreAuditRepository } from './infrastructure/persistence/firestore-audit.repository';

@Module({
  controllers: [AuditController],
  providers: [
    FirebaseService,
    {
      provide: AUDIT_REPOSITORY_TOKEN,
      useClass: FirestoreAuditRepository,
    },
    RecordAuditLogUseCase,
    GetAuditLogsUseCase,
  ],
  exports: [AUDIT_REPOSITORY_TOKEN, RecordAuditLogUseCase, GetAuditLogsUseCase],
})
export class AuditModule {}
