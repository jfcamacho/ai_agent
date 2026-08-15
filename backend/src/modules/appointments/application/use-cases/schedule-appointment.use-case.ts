import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AUDIT_REPOSITORY_TOKEN, IAuditRepositoryPort } from '../../../audit/domain/ports/audit-repository.port';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../../leads/domain/ports/lead-repository.port';
import { LeadStatus } from '../../../leads/domain/enums/lead-status.enum';
import { Appointment, AppointmentStatus } from '../../domain/entities/appointment.entity';
import { APPOINTMENT_REPOSITORY_TOKEN, IAppointmentRepositoryPort } from '../../domain/ports/appointment-repository.port';

@Injectable()
export class ScheduleAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN)
    private readonly appointmentRepo: IAppointmentRepositoryPort,
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
    @Inject(AUDIT_REPOSITORY_TOKEN)
    private readonly auditRepo: IAuditRepositoryPort,
  ) {}

  async execute(payload: {
    leadId: string;
    meetingDate: string;
    meetingTime: string;
    durationMinutes?: number;
    hunterName?: string;
    agendaSummary?: string;
  }): Promise<Appointment> {
    const lead = await this.leadRepo.findById(payload.leadId);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${payload.leadId} not found`);
    }

    const appointment = new Appointment({
      id: `apt_${Date.now()}`,
      leadId: lead.id,
      companyId: lead.companyId,
      companyName: lead.companyName,
      contactName: lead.primaryContact?.name || 'Decisor Aliado',
      contactEmail: lead.primaryContact?.email || `contacto@${lead.domain}`,
      hunterName: payload.hunterName || 'Hunter Inter.mx',
      hunterEmail: 'alianzas@inter.mx',
      meetingDate: payload.meetingDate,
      meetingTime: payload.meetingTime,
      durationMinutes: payload.durationMinutes || 30,
      meetingLink: `https://meet.google.com/intermx-${Math.random().toString(36).substr(2, 6)}`,
      agendaSummary: payload.agendaSummary || 'Sesión de alineación estratégica para distribución de seguros B2B2C.',
      crmSyncStatus: 'SYNCED_VIRTUAL_CRM',
      status: AppointmentStatus.CONFIRMED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await this.appointmentRepo.save(appointment);

    lead.status = LeadStatus.MEETING_SCHEDULED;
    lead.updatedAt = new Date().toISOString();
    await this.leadRepo.save(lead);

    await this.auditRepo.record({
      eventType: 'QUALIFIED_MEETING_SCHEDULED',
      entityId: appointment.id,
      performedBy: payload.hunterName || 'Hunter Inter.mx',
      details: {
        leadId: lead.id,
        companyName: lead.companyName,
        meetingDate: payload.meetingDate,
        meetingTime: payload.meetingTime,
        meetingLink: appointment.meetingLink
      }
    });

    return appointment;
  }
}
