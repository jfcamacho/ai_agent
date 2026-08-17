export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED'
}

export class Appointment {
  id: string;
  leadId: string;
  companyId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  hunterName: string;
  hunterEmail: string;
  meetingDate: string;
  meetingTime: string;
  durationMinutes: number;
  meetingLink: string;
  googleCalendarUrl?: string;
  agendaSummary: string;
  crmSyncStatus: 'SYNCED_VIRTUAL_CRM' | 'PENDING';
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<Appointment>) {
    Object.assign(this, partial);
  }
}
