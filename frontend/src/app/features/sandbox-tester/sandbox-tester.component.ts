import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Lead, VirtualOutboxRecord } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-sandbox-tester',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    TextareaModule,
    DividerModule
  ],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Bar -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Panel de Simulación Sandbox & Buzón Virtual</h1>
            <p-tag value="Pruebas 100% Seguras" severity="warn" icon="pi pi-shield"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Valida el ciclo de vida comercial completo, triaje de respuestas en lenguaje natural y activación de guardrails.
          </p>
        </div>

        <div class="flex align-items-center gap-2">
          <p-button
            label="Vaciar Sandbox"
            icon="pi pi-trash"
            [outlined]="true"
            severity="danger"
            size="small"
            (onClick)="resetSandbox()"
          ></p-button>
          <p-button label="Actualizar Datos" icon="pi pi-refresh" [outlined]="true" severity="secondary" size="small" (onClick)="refreshAll()"></p-button>
        </div>
      </div>

      <!-- Main Two Columns (PrimeFlex grid) -->
      <div class="grid">
        
        <!-- Left Column: Prospect Response Simulator -->
        <div class="col-12 lg:col-5">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-amber-500 flex flex-column gap-3">
            <div>
              <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                <i class="pi pi-bolt text-amber-400"></i>
                <span>Simulador de Respuestas del Prospecto</span>
              </h3>
              <p class="text-xs text-color-secondary mt-1 m-0">
                Selecciona la empresa con la que deseas interactuar y simula su respuesta:
              </p>
            </div>

            <!-- Visual Prospect Selector (Interactive Cards) -->
            <div class="flex flex-column gap-2 pt-1">
              <div class="flex justify-content-between align-items-center">
                <label class="text-xs font-bold text-color-secondary uppercase">
                  Empresa Seleccionada para la prueba:
                </label>
                <span class="text-xs text-primary font-bold">
                  {{ getSelectedLead()?.companyName || 'Ninguna seleccionada' }}
                </span>
              </div>

              <!-- List of Selectable Leads -->
              <div class="flex flex-column gap-2 max-h-12rem overflow-y-auto pr-1">
                <div
                  *ngFor="let lead of leads"
                  (click)="selectLead(lead.id)"
                  [class.border-primary]="selectedLeadId === lead.id"
                  [class.bg-blue-950]="selectedLeadId === lead.id"
                  class="surface-ground p-2 border-round-xl border-1 surface-border hover:border-primary cursor-pointer transition-all flex justify-content-between align-items-center"
                >
                  <div class="flex align-items-center gap-2">
                    <div
                      class="w-2rem h-2rem border-round-lg flex align-items-center justify-content-center font-bold text-xs"
                      [ngClass]="selectedLeadId === lead.id ? 'bg-primary text-white' : 'bg-slate-800 text-slate-300'"
                    >
                      {{ lead.companyName.charAt(0) }}
                    </div>
                    <div>
                      <strong class="text-xs text-white block">{{ lead.companyName }}</strong>
                      <span class="text-[10px] text-color-secondary">Decisor: {{ lead.primaryContact?.name || 'Alianzas' }}</span>
                    </div>
                  </div>

                  <div class="flex align-items-center gap-2">
                    <p-tag [value]="lead.status" [severity]="getStatusSeverity(lead.status)" styleClass="text-[10px]"></p-tag>
                    <i *ngIf="selectedLeadId === lead.id" class="pi pi-check-circle text-primary text-sm"></i>
                  </div>
                </div>

                <div *ngIf="leads.length === 0" class="p-3 text-center text-xs text-color-secondary surface-ground border-round-xl">
                  No hay prospectos en el Sandbox. Ejecuta una búsqueda proactiva o investiga una empresa en la Bandeja del Hunter.
                </div>
              </div>
            </div>

            <!-- Mode Selector: Pre-configured Scenarios vs Custom Natural Language -->
            <div class="flex border-round-xl surface-ground p-1 border-1 surface-border text-xs font-semibold">
              <button
                type="button"
                (click)="simMode = 'PRESET'"
                [style.background-color]="simMode === 'PRESET' ? '#1e3a8a' : 'transparent'"
                [style.color]="simMode === 'PRESET' ? '#ffffff' : '#94a3b8'"
                class="flex-1 py-1.5 border-none border-round-lg cursor-pointer transition-all font-semibold"
              >
                Escenarios Rápidos
              </button>
              <button
                type="button"
                (click)="simMode = 'CUSTOM'"
                [style.background-color]="simMode === 'CUSTOM' ? '#1e3a8a' : 'transparent'"
                [style.color]="simMode === 'CUSTOM' ? '#ffffff' : '#94a3b8'"
                class="flex-1 py-1.5 border-none border-round-lg cursor-pointer transition-all font-semibold"
              >
                ✍️ Texto Libre con IA
              </button>
            </div>

            <!-- 1. Preset Scenario Buttons -->
            <div *ngIf="simMode === 'PRESET'" class="flex flex-column gap-2 pt-1">
              <div
                (click)="simulateScenario('POSITIVE_INTEREST')"
                class="surface-ground p-3 border-round-xl border-1 surface-border hover:border-green-500 cursor-pointer transition-all"
                [class.opacity-50]="!selectedLeadId || isSimulating"
              >
                <div class="flex justify-content-between align-items-center mb-1">
                  <strong class="text-green-400 text-xs font-bold">1. Interés Positivo en Agendar Cita</strong>
                  <p-tag value="M11" severity="success"></p-tag>
                </div>
                <p class="text-xs text-slate-300 m-0">"¡Hola! Nos interesa la propuesta de Inter.mx. ¿Qué horarios tienen el martes para reunirnos?"</p>
              </div>

              <div
                (click)="simulateScenario('OPT_OUT_UNSUBSCRIBE')"
                class="surface-ground p-3 border-round-xl border-1 surface-border hover:border-rose-500 cursor-pointer transition-all"
                [class.opacity-50]="!selectedLeadId || isSimulating"
              >
                <div class="flex justify-content-between align-items-center mb-1">
                  <strong class="text-rose-400 text-xs font-bold">2. Solicitud de Baja / Opt-Out</strong>
                  <p-tag value="Guardrail 7.1" severity="danger"></p-tag>
                </div>
                <p class="text-xs text-slate-300 m-0">"No estamos interesados. Por favor cancelar suscripción y eliminar nuestros datos."</p>
              </div>

              <div
                (click)="simulateScenario('OBJECTION')"
                class="surface-ground p-3 border-round-xl border-1 surface-border hover:border-amber-500 cursor-pointer transition-all"
                [class.opacity-50]="!selectedLeadId || isSimulating"
              >
                <div class="flex justify-content-between align-items-center mb-1">
                  <strong class="text-amber-400 text-xs font-bold">3. Duda Comercial / Preguntas Técnicas</strong>
                  <p-tag value="Escalamiento" severity="warn"></p-tag>
                </div>
                <p class="text-xs text-slate-300 m-0">"¿Qué aseguradoras respaldan a Inter.mx y cuál es el costo de integración API?"</p>
              </div>
            </div>

            <!-- 2. Custom Natural Language Free-Text Input -->
            <div *ngIf="simMode === 'CUSTOM'" class="flex flex-column gap-2 pt-1">
              <label class="text-xs font-bold text-white">Escribe la respuesta libre del prospecto:</label>
              <textarea
                pTextarea
                [(ngModel)]="customReplyText"
                rows="3"
                placeholder="Ej. Me interesa mucho para mis 800 empleados. ¿Tienen disponibilidad el jueves a las 11:00 am para platicar?"
                class="w-full"
              ></textarea>
              
              <p-button
                label="🤖 Clasificar y Responder con IA"
                icon="pi pi-sparkles"
                severity="primary"
                size="small"
                [loading]="isSimulating"
                [disabled]="!selectedLeadId || !customReplyText.trim()"
                (onClick)="simulateCustomReply()"
              ></p-button>
            </div>

            <!-- Simulation Result Box -->
            <div *ngIf="simulationResult" class="surface-card p-3 border-round-xl border-1 surface-border flex flex-column gap-3 shadow-3">
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Resultado del Triaje con IA:</span>
                <p-tag
                  [value]="simulationResult.triageResult?.sentiment"
                  [severity]="simulationResult.triageResult?.sentiment === 'POSITIVE_INTEREST' ? 'success' : (simulationResult.triageResult?.sentiment === 'OPT_OUT_UNSUBSCRIBE' ? 'danger' : 'warn')"
                ></p-tag>
              </div>

              <div class="text-xs flex flex-column gap-2">
                <div class="surface-ground p-2 border-round-lg border-1 surface-border">
                  <span class="text-color-secondary text-[11px] block mb-0.5">Acción Ejecutada:</span>
                  <strong style="color: #ffffff !important; font-size: 13px;" class="block">
                    {{ simulationResult.triageResult?.recommendedNextAction }}
                  </strong>
                </div>

                <div class="surface-ground p-2 border-round-lg border-1 surface-border">
                  <span class="text-color-secondary text-[11px] block mb-0.5">Análisis Cognitivo del Agente:</span>
                  <p style="color: #f1f5f9 !important; white-space: pre-wrap;" class="m-0 line-height-3 text-xs">
                    {{ simulationResult.triageResult?.analysis }}
                  </p>
                </div>
                
                <!-- Auto-scheduled Appointment Box -->
                <div *ngIf="simulationResult.autoScheduledAppointment" style="background-color: #160d29 !important; border: 1.5px solid #8b5cf6 !important;" class="p-3 border-round-xl flex flex-column gap-2">
                  <div class="flex align-items-center gap-2">
                    <span style="color: #c084fc !important;" class="font-bold text-xs uppercase tracking-wider">🎯 Cita Calificada Agendada Automáticamente</span>
                  </div>

                  <div style="background-color: #090614 !important; border: 1px solid #4c1d95 !important;" class="p-3 border-round-lg">
                    <span style="color: #94a3b8 !important;" class="text-xs block mb-1">Fecha y Hora Confirmada:</span>
                    <div style="color: #ffffff !important; font-size: 15px; font-weight: 800;" class="font-mono">
                      📅 {{ simulationResult.autoScheduledAppointment.meetingDate }} a las {{ simulationResult.autoScheduledAppointment.meetingTime }}
                    </div>
                    <span style="color: #38bdf8 !important;" class="text-xs mt-2 block font-semibold">
                      Duración: {{ simulationResult.autoScheduledAppointment.durationMinutes || 30 }} min · Google Meet Sincronizado
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Right Column: Virtual Outbox Inspector -->
        <div class="col-12 lg:col-7">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column gap-3">
            <div class="flex justify-content-between align-items-center">
              <div>
                <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                  <i class="pi pi-inbox text-primary"></i>
                  <span>Buzón Virtual de Salida Seguro (Virtual Outbox)</span>
                </h3>
                <p class="text-xs text-color-secondary mt-1 m-0">
                  Registro visual exacto de los correos autorizados por el Hunter en el Sandbox, tal como los recibiría el prospecto.
                </p>
              </div>
              <p-tag [value]="outboxRecords.length + ' correos'" severity="info"></p-tag>
            </div>

            <!-- Records List -->
            <div class="flex flex-column gap-3 max-h-30rem overflow-y-auto pr-1">
              <div
                *ngFor="let record of outboxRecords"
                class="surface-ground p-3 border-round-xl border-1 surface-border flex flex-column gap-2"
              >
                <div class="flex justify-content-between align-items-center text-xs pb-2 border-bottom-1 surface-border">
                  <div>
                    <span class="font-bold text-white">{{ record.companyName }}</span>
                    <span class="text-color-secondary font-mono block text-[11px]">Para: {{ record.recipientName }} &lt;{{ record.recipientEmail }}&gt;</span>
                  </div>
                  <div class="text-right">
                    <p-tag [value]="record.status" severity="info" styleClass="mb-1"></p-tag>
                    <span class="text-[10px] text-color-secondary font-mono block">{{ record.deliveredAt }}</span>
                  </div>
                </div>

                <div>
                  <span class="text-xs font-semibold text-cyan-400 block mb-1">Asunto: {{ record.subject }}</span>
                  <div [innerHTML]="record.renderedHtmlBody" class="surface-card p-3 border-round-lg border-1 surface-border text-xs text-slate-200"></div>
                </div>
              </div>

              <div *ngIf="outboxRecords.length === 0" class="py-6 text-center text-color-secondary text-xs">
                El buzón virtual de salida está vacío. Aprueba un borrador en la Bandeja del Hunter para verlo despachado aquí de forma segura.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class SandboxTesterComponent implements OnInit {
  leads: Lead[] = [];
  outboxRecords: VirtualOutboxRecord[] = [];
  selectedLeadId = '';
  simMode: 'PRESET' | 'CUSTOM' = 'PRESET';
  customReplyText = 'Hola, revisé su correo y nos parece una excelente propuesta de seguros para nuestros usuarios. ¿Tienen espacio este miércoles a las 10:00 am para una llamada de 20 minutos?';
  isSimulating = false;
  simulationResult: any = null;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadLeads();
    this.loadOutbox();
  }

  loadLeads(): void {
    this.apiService.getLeads().subscribe({
      next: (data) => {
        this.leads = data;
        if (data.length > 0) {
          const exists = data.some(l => l.id === this.selectedLeadId);
          if (!exists) {
            this.selectedLeadId = data[0].id;
          }
        } else {
          this.selectedLeadId = '';
        }
      },
      error: (err) => console.error('Error in sandbox leads:', err)
    });
  }

  selectLead(leadId: string): void {
    this.selectedLeadId = leadId;
  }

  getSelectedLead(): Lead | undefined {
    return this.leads.find(l => l.id === this.selectedLeadId);
  }

  loadOutbox(): void {
    this.apiService.getVirtualOutbox().subscribe({
      next: (data) => this.outboxRecords = data,
      error: (err) => console.error('Error fetching outbox:', err)
    });
  }

  resetSandbox(): void {
    if (!confirm('¿Estás seguro de que deseas vaciar y reiniciar el Sandbox a estado cero?')) return;
    this.apiService.resetSandbox().subscribe({
      next: () => {
        this.leads = [];
        this.outboxRecords = [];
        this.simulationResult = null;
        this.selectedLeadId = '';
        alert('El Sandbox ha sido vaciado y reiniciado completamente.');
      },
      error: (err) => alert(`Error al vaciar: ${err.error?.message || err.message}`)
    });
  }

  simulateScenario(scenario: 'POSITIVE_INTEREST' | 'OPT_OUT_UNSUBSCRIBE' | 'OBJECTION'): void {
    if (!this.selectedLeadId) return;
    this.isSimulating = true;
    this.simulationResult = null;

    this.apiService.simulateProspectReply({
      leadId: this.selectedLeadId,
      scenario
    }).subscribe({
      next: (res) => {
        this.simulationResult = res;
        this.isSimulating = false;
        this.loadLeads();
        this.loadOutbox();
      },
      error: (err) => {
        this.isSimulating = false;
        alert(`Error en simulación: ${err.error?.message || err.message}`);
      }
    });
  }

  simulateCustomReply(): void {
    if (!this.selectedLeadId || !this.customReplyText.trim()) return;
    this.isSimulating = true;
    this.simulationResult = null;

    this.apiService.simulateProspectReply({
      leadId: this.selectedLeadId,
      scenario: 'CUSTOM',
      customReplyText: this.customReplyText.trim()
    }).subscribe({
      next: (res) => {
        this.simulationResult = res;
        this.isSimulating = false;
        this.loadLeads();
        this.loadOutbox();
      },
      error: (err) => {
        this.isSimulating = false;
        alert(`Error en simulación: ${err.error?.message || err.message}`);
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (status === 'MEETING_SCHEDULED') return 'success';
    if (status === 'POSITIVE_REPLY' || status === 'APPROVED_BY_HUNTER') return 'info';
    if (status === 'CONTACTED') return 'warn';
    if (status === 'OPT_OUT_HALTED' || status === 'REJECTED_BY_HUNTER') return 'danger';
    return 'secondary';
  }
}
