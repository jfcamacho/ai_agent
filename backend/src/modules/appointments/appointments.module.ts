import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { LeadsModule } from '../leads/leads.module';
import { FirebaseService } from '../shared/database/firebase.service';
import { GetAppointmentsUseCase } from './application/use-cases/get-appointments.use-case';
import { ScheduleAppointmentUseCase } from './application/use-cases/schedule-appointment.use-case';
import { APPOINTMENT_REPOSITORY_TOKEN } from './domain/ports/appointment-repository.port';
import { AppointmentsController } from './infrastructure/controllers/appointments.controller';
import { FirestoreAppointmentRepository } from './infrastructure/persistence/firestore-appointment.repository';

@Module({
  imports: [LeadsModule, AuditModule],
  controllers: [AppointmentsController],
  providers: [
    FirebaseService,
    {
      provide: APPOINTMENT_REPOSITORY_TOKEN,
      useClass: FirestoreAppointmentRepository,
    },
    GetAppointmentsUseCase,
    ScheduleAppointmentUseCase,
  ],
  exports: [APPOINTMENT_REPOSITORY_TOKEN, GetAppointmentsUseCase, ScheduleAppointmentUseCase],
})
export class AppointmentsModule {}
