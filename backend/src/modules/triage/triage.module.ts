import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { IcpConfigModule } from '../icp-config/icp-config.module';
import { LeadsModule } from '../leads/leads.module';
import { FirebaseService } from '../shared/database/firebase.service';
import { ProcessResponseUseCase } from './application/use-cases/process-response.use-case';
import { TriageController } from './infrastructure/controllers/triage.controller';

@Module({
  imports: [LeadsModule, IcpConfigModule, AuditModule],
  controllers: [TriageController],
  providers: [FirebaseService, ProcessResponseUseCase],
  exports: [ProcessResponseUseCase],
})
export class TriageModule {}
