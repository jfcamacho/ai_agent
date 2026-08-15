import { Appointment } from '../entities/appointment.entity';

export const APPOINTMENT_REPOSITORY_TOKEN = 'APPOINTMENT_REPOSITORY_PORT';

export interface IAppointmentRepositoryPort {
  findAll(): Promise<Appointment[]>;
  findById(id: string): Promise<Appointment | null>;
  findByLeadId(leadId: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
}
