import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { CompaniesModule } from '../companies/companies.module';
import { LeadsModule } from '../leads/leads.module';
import { OutreachModule } from '../outreach/outreach.module';
import { GetDashboardMetricsUseCase } from './application/use-cases/get-dashboard-metrics.use-case';
import { MetricsDashboardController } from './infrastructure/controllers/metrics-dashboard.controller';

@Module({
  imports: [CompaniesModule, LeadsModule, OutreachModule, AppointmentsModule],
  controllers: [MetricsDashboardController],
  providers: [GetDashboardMetricsUseCase],
  exports: [GetDashboardMetricsUseCase],
})
export class MetricsDashboardModule {}
