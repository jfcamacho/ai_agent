import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuditModule } from './modules/audit/audit.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { IcpConfigModule } from './modules/icp-config/icp-config.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { LeadsModule } from './modules/leads/leads.module';
import { MetricsDashboardModule } from './modules/metrics-dashboard/metrics-dashboard.module';
import { OutreachModule } from './modules/outreach/outreach.module';
import { SandboxSimulatorModule } from './modules/sandbox-simulator/sandbox-simulator.module';
import { FirebaseService } from './modules/shared/database/firebase.service';
import { GuardrailsValidator } from './modules/shared/guards/guardrails.validator';
import { TriageModule } from './modules/triage/triage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CompaniesModule,
    LeadsModule,
    OutreachModule,
    TriageModule,
    AppointmentsModule,
    IcpConfigModule,
    MetricsDashboardModule,
    AuditModule,
    SandboxSimulatorModule,
    IntegrationsModule,
  ],
  providers: [FirebaseService, GuardrailsValidator],
  exports: [FirebaseService, GuardrailsValidator],
})
export class AppModule {}
