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

    const duration = payload.durationMinutes || 30;
    const meetCode = `intermx-${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 3)}`;
    const meetingLink = `https://meet.google.com/${meetCode}`;
    const hunterName = payload.hunterName || 'Santiago Romero - Alianzas Inter.mx';
    const hunterEmail = 'alianzas@inter.mx';
    const contactName = lead.primaryContact?.name || 'Decisor Aliado';
    const contactEmail = lead.primaryContact?.email || `contacto@${lead.domain}`;
    const agenda = payload.agendaSummary || 'Sesión de exploración y sinergia estratégica para distribución de seguros y beneficios B2B2C.';

    // Generate Google Calendar 1-Click Sync URL
    const googleCalendarUrl = this.generateGoogleCalendarLink({
      title: `Alianza Estratégica Inter.mx <> ${lead.companyName}`,
      meetingDate: payload.meetingDate,
      meetingTime: payload.meetingTime,
      durationMinutes: duration,
      description: `🎯 Objetivo de la reunión:\n${agenda}\n\n🎥 Enlace de Google Meet: ${meetingLink}\n\nParticipantes:\n• ${hunterName} (${hunterEmail})\n• ${contactName} (${contactEmail})\n\n---\nOrganizado automáticamente por Agente de IA Hunting Inter.mx`,
      location: meetingLink,
      attendees: [contactEmail, hunterEmail]
    });

    const appointment = new Appointment({
      id: `apt_${Date.now()}`,
      leadId: lead.id,
      companyId: lead.companyId,
      companyName: lead.companyName,
      contactName,
      contactEmail,
      hunterName,
      hunterEmail,
      meetingDate: payload.meetingDate,
      meetingTime: payload.meetingTime,
      durationMinutes: duration,
      meetingLink,
      googleCalendarUrl,
      agendaSummary: agenda,
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
      performedBy: hunterName,
      details: {
        leadId: lead.id,
        companyName: lead.companyName,
        meetingDate: payload.meetingDate,
        meetingTime: payload.meetingTime,
        meetingLink: appointment.meetingLink,
        googleCalendarUrl: appointment.googleCalendarUrl
      }
    });

    return appointment;
  }

  private generateGoogleCalendarLink(params: {
    title: string;
    meetingDate: string; // YYYY-MM-DD
    meetingTime: string; // e.g. "11:00 AM" or "14:30"
    durationMinutes: number;
    description: string;
    location: string;
    attendees: string[];
  }): string {
    try {
      // Parse Date
      const dateParts = params.meetingDate.split('-');
      const year = parseInt(dateParts[0], 10) || new Date().getFullYear();
      const month = (parseInt(dateParts[1], 10) || (new Date().getMonth() + 1)) - 1;
      const day = parseInt(dateParts[2], 10) || new Date().getDate();

      // Parse Time (supports "11:00 AM", "2:30 PM", "14:00")
      let hours = 10;
      let minutes = 0;
      const timeLower = params.meetingTime.toLowerCase();
      const isPm = timeLower.includes('pm');
      const isAm = timeLower.includes('am');
      const timeClean = params.meetingTime.replace(/[^\d:]/g, '');
      const timeParts = timeClean.split(':');
      if (timeParts.length >= 1) {
        hours = parseInt(timeParts[0], 10) || 10;
        if (isPm && hours < 12) hours += 12;
        if (isAm && hours === 12) hours = 0;
      }
      if (timeParts.length >= 2) {
        minutes = parseInt(timeParts[1], 10) || 0;
      }

      const startDate = new Date(Date.UTC(year, month, day, hours, minutes));
      const endDate = new Date(startDate.getTime() + params.durationMinutes * 60 * 1000);

      const formatUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      const dateRange = `${formatUtc(startDate)}/${formatUtc(endDate)}`;

      const url = new URL('https://calendar.google.com/calendar/render');
      url.searchParams.set('action', 'TEMPLATE');
      url.searchParams.set('text', params.title);
      url.searchParams.set('dates', dateRange);
      url.searchParams.set('details', params.description);
      url.searchParams.set('location', params.location);
      if (params.attendees.length > 0) {
        url.searchParams.set('add', params.attendees.join(','));
      }

      return url.toString();
    } catch (e) {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(params.title)}`;
    }
  }
}
