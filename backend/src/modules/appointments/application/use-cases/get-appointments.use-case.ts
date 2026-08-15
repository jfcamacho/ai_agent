import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { APPOINTMENT_REPOSITORY_TOKEN, IAppointmentRepositoryPort } from '../../domain/ports/appointment-repository.port';

@Injectable()
export class GetAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepo: IAppointmentRepositoryPort,
  ) {}

  async execute(): Promise<Appointment[]> {
    return this.appointmentRepo.findAll();
  }
}
