import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuditLog } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TableModule],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Bar -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Registro de Auditoría & Trazabilidad Inmutable</h1>
            <p-tag value="Guardrails & Compliance (7.1)" severity="info"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Historial inalterable de cada evaluación, llamada al Agente de IA, aprobación del Hunter y activación de guardrails.
          </p>
        </div>

        <p-button label="Actualizar Log" icon="pi pi-refresh" [outlined]="true" severity="secondary" size="small" (onClick)="loadLogs()"></p-button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <!-- Audit Logs Table (PrimeNG Table) -->
      <div *ngIf="!isLoading && logs.length > 0" class="surface-card border-round-2xl border-1 surface-border overflow-hidden">
        <p-table [value]="logs" responsiveLayout="scroll" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Timestamp</th>
              <th>Tipo de Evento</th>
              <th>Ejecutado Por</th>
              <th>ID Entidad</th>
              <th>Detalles del Evento</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-log>
            <tr>
              <td class="font-mono text-color-secondary whitespace-nowrap text-xs">{{ log.timestamp }}</td>
              <td>
                <p-tag [value]="log.eventType" [severity]="getEventSeverity(log.eventType)"></p-tag>
              </td>
              <td class="font-bold text-white text-xs">{{ log.performedBy }}</td>
              <td class="font-mono text-color-secondary text-xs">{{ log.entityId }}</td>
              <td>
                <pre class="surface-ground p-2 border-round-lg text-[10px] text-slate-300 font-mono m-0 max-w-20rem overflow-x-auto">{{ log.details | json }}</pre>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && logs.length === 0" class="surface-card p-6 border-round-2xl border-1 surface-border text-center text-color-secondary text-sm">
        No hay registros de auditoría aún.
      </div>

    </div>
  `
})
export class AuditLogsComponent implements OnInit {
  logs: AuditLog[] = [];
  isLoading = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.apiService.getAuditLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching audit logs:', err);
        this.isLoading = false;
      }
    });
  }

  getEventSeverity(eventType: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (eventType.includes('OUTREACH') || eventType.includes('APPROV')) return 'info';
    if (eventType.includes('MEETING') || eventType.includes('POSITIVE')) return 'success';
    if (eventType.includes('OPT_OUT') || eventType.includes('GUARDRAIL') || eventType.includes('REJECT')) return 'danger';
    return 'secondary';
  }
}
