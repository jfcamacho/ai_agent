import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { LeadsModule } from '../leads/leads.module';
import { FirebaseService } from '../shared/database/firebase.service';
import { TriageModule } from '../triage/triage.module';
import { SimulateProspectReplyUseCase } from './application/use-cases/simulate-prospect-reply.use-case';
import { SandboxSimulatorController } from './infrastructure/controllers/sandbox-simulator.controller';

@Module({
  imports: [LeadsModule, TriageModule, AppointmentsModule],
  controllers: [SandboxSimulatorController],
  providers: [FirebaseService, SimulateProspectReplyUseCase],
  exports: [SimulateProspectReplyUseCase],
})
export class SandboxSimulatorModule {}
