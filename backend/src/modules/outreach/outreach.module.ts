import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { CompaniesModule } from '../companies/companies.module';
import { LeadsModule } from '../leads/leads.module';
import { FirebaseService } from '../shared/database/firebase.service';
import { GuardrailsValidator } from '../shared/guards/guardrails.validator';
import { ApproveAndSendOutreachUseCase } from './application/use-cases/approve-and-send-outreach.use-case';
import { GenerateOutreachDraftUseCase } from './application/use-cases/generate-outreach-draft.use-case';
import { GetVirtualOutboxUseCase } from './application/use-cases/get-virtual-outbox.use-case';
import { OUTREACH_REPOSITORY_TOKEN } from './domain/ports/outreach-repository.port';
import { VIRTUAL_OUTBOX_PORT_TOKEN } from './domain/ports/virtual-outbox.port';
import { OutreachController } from './infrastructure/controllers/outreach.controller';
import { FirestoreOutreachRepository } from './infrastructure/persistence/firestore-outreach.repository';
import { VirtualOutboxAdapter } from './infrastructure/sandbox/virtual-outbox.adapter';

@Module({
  imports: [LeadsModule, CompaniesModule, AuditModule],
  controllers: [OutreachController],
  providers: [
    FirebaseService,
    GuardrailsValidator,
    {
      provide: OUTREACH_REPOSITORY_TOKEN,
      useClass: FirestoreOutreachRepository,
    },
    {
      provide: VIRTUAL_OUTBOX_PORT_TOKEN,
      useClass: VirtualOutboxAdapter,
    },
    GenerateOutreachDraftUseCase,
    ApproveAndSendOutreachUseCase,
    GetVirtualOutboxUseCase,
  ],
  exports: [
    OUTREACH_REPOSITORY_TOKEN,
    VIRTUAL_OUTBOX_PORT_TOKEN,
    GenerateOutreachDraftUseCase,
    ApproveAndSendOutreachUseCase,
    GetVirtualOutboxUseCase,
  ],
})
export class OutreachModule {}
