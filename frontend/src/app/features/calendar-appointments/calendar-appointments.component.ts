import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Appointment } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-calendar-appointments',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TooltipModule],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Bar -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Citas Calificadas & Calendario</h1>
            <p-tag value="Métrica Norte (M11)" severity="success"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Reuniones comerciales B2B2C confirmadas, sincronizadas con Google Calendar, Google Meet y el CRM corporativo.
          </p>
        </div>

        <div class="flex align-items-center gap-2">
          <span class="text-xs text-color-secondary surface-ground px-3 py-2 border-round-xl border-1 surface-border">
            Total Citas: <strong class="text-white">{{ appointments.length }}</strong>
          </span>
          <p-button label="Actualizar" icon="pi pi-refresh" [outlined]="true" severity="secondary" size="small" (onClick)="loadAppointments()"></p-button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <!-- Appointments Grid (PrimeFlex grid) -->
      <div *ngIf="!isLoading && appointments.length > 0" class="grid">
        <div *ngFor="let apt of appointments" class="col-12 md:col-6">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-purple-500 h-full flex flex-column justify-content-between gap-3 shadow-2">
            
            <div>
              <!-- Header -->
              <div class="flex justify-content-between align-items-start gap-2 mb-3">
                <div class="flex align-items-center gap-3">
                  <div class="w-3rem h-3rem border-round-xl bg-purple-900/40 text-purple-400 border-1 border-purple-800/50 flex align-items-center justify-content-center text-xl font-bold">
                    <i class="pi pi-calendar"></i>
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-white m-0">{{ apt.companyName }}</h3>
                    <span class="text-xs text-color-secondary">{{ apt.contactName }} ({{ apt.contactEmail }})</span>
                  </div>
                </div>

                <p-tag [value]="'✓ ' + apt.status" severity="success"></p-tag>
              </div>

              <!-- Date & Time Info -->
              <div class="grid surface-ground p-3 border-round-xl border-1 surface-border text-xs mb-3">
                <div class="col-6">
                  <span class="text-color-secondary block mb-1">📅 Fecha y Hora:</span>
                  <strong class="text-white font-mono">{{ apt.meetingDate }} a las {{ apt.meetingTime }}</strong>
                </div>
                <div class="col-6">
                  <span class="text-color-secondary block mb-1">⏱️ Duración:</span>
                  <strong class="text-cyan-400">{{ apt.durationMinutes }} minutos</strong>
                </div>
              </div>

              <!-- Agenda Summary -->
              <div class="surface-ground p-3 border-round-xl border-1 surface-border text-xs text-slate-300 mb-3">
                <span class="text-color-secondary font-bold uppercase text-[10px] block mb-1">🎯 Objetivo de la Sesión:</span>
                {{ apt.agendaSummary }}
              </div>

              <!-- Host Info -->
              <div class="text-[11px] text-color-secondary flex align-items-center gap-2">
                <i class="pi pi-user text-xs text-purple-400"></i>
                <span>Hunter Asignado: <strong class="text-white">{{ apt.hunterName }}</strong></span>
              </div>
            </div>

            <!-- Footer & Actions (Google Calendar, Meet, ICS) -->
            <div class="pt-3 border-top-1 surface-border flex flex-column gap-2">
              <div class="flex justify-content-between align-items-center text-xs">
                <p-tag [value]="'CRM: ' + apt.crmSyncStatus" severity="info"></p-tag>
                <span class="text-[11px] text-green-400 flex align-items-center gap-1 font-semibold">
                  <i class="pi pi-check-circle text-xs"></i> Google Sync Activo
                </span>
              </div>

              <div class="flex flex-wrap gap-2 mt-1">
                <!-- 1-Click Google Calendar Button -->
                <a
                  [href]="apt.googleCalendarUrl || getFallbackCalendarUrl(apt)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="no-underline flex-1"
                >
                  <p-button
                    label="Google Calendar"
                    icon="pi pi-calendar-plus"
                    severity="help"
                    size="small"
                    styleClass="w-full text-xs font-semibold"
                    pTooltip="Añadir evento con 1 clic a tu Google Calendar"
                  ></p-button>
                </a>

                <!-- Google Meet Link -->
                <a
                  [href]="apt.meetingLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="no-underline flex-1"
                >
                  <p-button
                    label="Google Meet"
                    icon="pi pi-video"
                    severity="primary"
                    size="small"
                    styleClass="w-full text-xs font-semibold"
                    pTooltip="Abrir sala de videoconferencia"
                  ></p-button>
                </a>

                <!-- ICS Download Button -->
                <p-button
                  icon="pi pi-download"
                  [outlined]="true"
                  severity="secondary"
                  size="small"
                  (onClick)="downloadIcs(apt)"
                  pTooltip="Descargar archivo .ics para Outlook/Apple Calendar"
                ></p-button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && appointments.length === 0" class="surface-card p-6 border-round-2xl border-1 surface-border text-center">
        <i class="pi pi-calendar-times text-5xl text-color-secondary mb-3"></i>
        <h3 class="text-lg font-bold text-white m-0">No hay citas confirmadas aún</h3>
        <p class="text-xs text-color-secondary mt-1">
          A medida que contactes prospectos y estos respondan positivamente en el Triage (M10), el Agente coordinará los espacios en el calendario y se sincronizarán aquí automáticamente.
        </p>
      </div>

    </div>
  `
})
export class CalendarAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.apiService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching appointments:', err);
        this.isLoading = false;
      }
    });
  }

  getFallbackCalendarUrl(apt: Appointment): string {
    const title = encodeURIComponent(`Alianza Estratégica Inter.mx <> ${apt.companyName}`);
    const details = encodeURIComponent(`${apt.agendaSummary}\n\nEnlace a Google Meet: ${apt.meetingLink}\nInvitado: ${apt.contactEmail}`);
    const location = encodeURIComponent(apt.meetingLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }

  downloadIcs(apt: Appointment): void {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Inter.mx//AI Hunting Agent//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${apt.id}@inter.mx`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `SUMMARY:Alianza Estratégica Inter.mx <> ${apt.companyName}`,
      `DESCRIPTION:${apt.agendaSummary}\\n\\nGoogle Meet: ${apt.meetingLink}`,
      `LOCATION:${apt.meetingLink}`,
      `STATUS:CONFIRMED`,
      `ORGANIZER;CN=Alianzas Inter.mx:mailto:alianzas@inter.mx`,
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${apt.contactName}:mailto:${apt.contactEmail}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cita_Intermx_${apt.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
