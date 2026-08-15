import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { IcpConfigModule } from '../icp-config/icp-config.module';
import { FirebaseService } from '../shared/database/firebase.service';
import { ApproveLeadUseCase } from './application/use-cases/approve-lead.use-case';
import { GetLeadsUseCase } from './application/use-cases/get-leads.use-case';
import { InvestigateCompanyUseCase } from './application/use-cases/investigate-company.use-case';
import { RejectLeadUseCase } from './application/use-cases/reject-lead.use-case';
import { TriggerDiscoveryUseCase } from './application/use-cases/trigger-discovery.use-case';
import { AGENT_SERVICE_PORT_TOKEN } from './domain/ports/agent-service.port';
import { LEAD_REPOSITORY_TOKEN } from './domain/ports/lead-repository.port';
import { LeadsController } from './infrastructure/controllers/leads.controller';
import { AgentServiceHttpAdapter } from './infrastructure/http/agent-service-http.adapter';
import { FirestoreLeadRepository } from './infrastructure/persistence/firestore-lead.repository';

@Module({
  imports: [CompaniesModule, IcpConfigModule],
  controllers: [LeadsController],
  providers: [
    FirebaseService,
    {
      provide: LEAD_REPOSITORY_TOKEN,
      useClass: FirestoreLeadRepository,
    },
    {
      provide: AGENT_SERVICE_PORT_TOKEN,
      useClass: AgentServiceHttpAdapter,
    },
    GetLeadsUseCase,
    ApproveLeadUseCase,
    RejectLeadUseCase,
    TriggerDiscoveryUseCase,
    InvestigateCompanyUseCase,
  ],
  exports: [
    LEAD_REPOSITORY_TOKEN,
    AGENT_SERVICE_PORT_TOKEN,
    GetLeadsUseCase,
    ApproveLeadUseCase,
    RejectLeadUseCase,
    TriggerDiscoveryUseCase,
    InvestigateCompanyUseCase,
  ],
})
export class LeadsModule {}
