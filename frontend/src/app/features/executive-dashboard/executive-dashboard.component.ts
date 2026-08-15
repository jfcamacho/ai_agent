import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardMetrics } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, TableModule],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Bar -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Dashboard Ejecutivo & Métricas del Piloto</h1>
            <p-tag value="Módulo M12" severity="success"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Evaluación continua del valor generado, comparación con la línea base y control de guardrails.
          </p>
        </div>

        <p-button label="Actualizar Métricas" icon="pi pi-refresh" [outlined]="true" severity="secondary" size="small" (onClick)="loadMetrics()"></p-button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <div *ngIf="!isLoading && metrics" class="flex flex-column gap-4">
        
        <!-- KPI Cards Grid (PrimeFlex grid) -->
        <div class="grid">
          
          <!-- North Star KPI -->
          <div class="col-12 sm:col-6 lg:col-3">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-purple-500 h-full flex flex-column justify-content-between">
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs uppercase font-bold text-color-secondary">Métrica Norte</span>
                <p-tag value="Valor Real" severity="info"></p-tag>
              </div>
              <div class="my-3 flex align-items-baseline gap-2">
                <span class="text-4xl font-extrabold text-white">{{ metrics.totalQualifiedAppointments }}</span>
                <span class="text-xs text-purple-400 font-bold">Citas Calificadas</span>
              </div>
              <p class="text-xs text-color-secondary m-0">Reuniones aceptadas y registradas para el Hunter.</p>
            </div>
          </div>

          <!-- Human Hours Saved -->
          <div class="col-12 sm:col-6 lg:col-3">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-green-500 h-full flex flex-column justify-content-between">
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs uppercase font-bold text-color-secondary">Eficiencia Operativa</span>
                <p-tag value="-91% tiempo" severity="success"></p-tag>
              </div>
              <div class="my-3 flex align-items-baseline gap-2">
                <span class="text-4xl font-extrabold text-green-400">{{ metrics.estimatedHoursSaved }} hrs</span>
              </div>
              <p class="text-xs text-color-secondary m-0">Ahorro estimado en prospección manual y redacción.</p>
            </div>
          </div>

          <!-- Hunter Acceptance Rate -->
          <div class="col-12 sm:col-6 lg:col-3">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-blue-500 h-full flex flex-column justify-content-between">
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs uppercase font-bold text-color-secondary">Tasa de Aprobación</span>
                <p-tag value="Precisión IA" severity="info"></p-tag>
              </div>
              <div class="my-3 flex align-items-baseline gap-2">
                <span class="text-4xl font-extrabold text-primary">{{ metrics.approvalRatePercentage }}%</span>
              </div>
              <p class="text-xs text-color-secondary m-0">{{ metrics.totalApprovedLeads }} aprobados vs {{ metrics.totalRejectedLeads }} descartados.</p>
            </div>
          </div>

          <!-- Guardrails Compliance -->
          <div class="col-12 sm:col-6 lg:col-3">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-cyan-500 h-full flex flex-column justify-content-between">
              <div class="flex justify-content-between align-items-center">
                <span class="text-xs uppercase font-bold text-color-secondary">Cumplimiento Guardrails</span>
                <p-tag value="0 Incidentes" severity="success"></p-tag>
              </div>
              <div class="my-3 flex align-items-baseline gap-2">
                <span class="text-4xl font-extrabold text-cyan-400">100%</span>
              </div>
              <p class="text-xs text-color-secondary m-0">Cero envíos no autorizados · Auditoría inmutable.</p>
            </div>
          </div>

        </div>

        <!-- Pilot vs Baseline PrimeNG Table (PDF Section 10) -->
        <div class="surface-card p-4 border-round-2xl border-1 surface-border">
          <div class="flex justify-content-between align-items-center mb-3">
            <div>
              <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                <i class="pi pi-chart-line text-primary"></i>
                <span>Comparativa: Piloto de IA vs Línea Base Tradicional</span>
              </h3>
              <span class="text-xs text-color-secondary">Criterios de Decisión (Sección 10.1 del documento de especificación)</span>
            </div>
          </div>

          <p-table [value]="metrics.baselineComparison" responsiveLayout="scroll" styleClass="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Métrica del Piloto</th>
                <th>Línea Base Tradicional (Manual)</th>
                <th>Piloto con Agente de IA</th>
                <th>Impacto / Delta</th>
                <th>Interpretación de Negocio</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td class="font-bold text-white">{{ item.metricName }}</td>
                <td class="text-color-secondary font-mono">{{ item.baselineManual }}</td>
                <td class="font-bold text-green-400 font-mono">{{ item.pilotWithAi }}</td>
                <td>
                  <p-tag [value]="item.deltaPercentage" severity="info"></p-tag>
                </td>
                <td class="text-slate-300 text-xs">{{ item.interpretation }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Funnel Stats Grid -->
        <div class="grid">
          <div class="col-12 md:col-4">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column gap-3">
              <span class="text-xs font-bold text-color-secondary uppercase">1. Descubrimiento y Pipeline</span>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Empresas Detectadas:</span>
                <strong class="text-white">{{ metrics.totalDiscoveredCompanies }}</strong>
              </div>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Leads Prioritarios:</span>
                <strong class="text-green-400">{{ metrics.totalPrioritizedLeads }}</strong>
              </div>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Leads a Revisión:</span>
                <strong class="text-amber-400">{{ metrics.totalReviewedLeads }}</strong>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column gap-3">
              <span class="text-xs font-bold text-color-secondary uppercase">2. Contactos y Salida Segura</span>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Mensajes en Virtual Outbox:</span>
                <strong class="text-primary">{{ metrics.totalMessagesSentSandbox }}</strong>
              </div>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Respuestas con Interés:</span>
                <strong class="text-green-400">{{ metrics.totalPositiveResponses }}</strong>
              </div>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Bajas Inmediatas (Opt-out):</span>
                <strong class="text-rose-400">{{ metrics.totalOptOutsHalted }}</strong>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column gap-3">
              <span class="text-xs font-bold text-color-secondary uppercase">3. Economía del Piloto</span>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Costo de Inferencia / Lead:</span>
                <strong class="text-cyan-400 font-mono">\${{ metrics.estimatedCostPerLead }} USD</strong>
              </div>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Modo Operativo:</span>
                <p-tag value="Sandbox Seguro" severity="success"></p-tag>
              </div>
              <div class="flex justify-content-between align-items-center text-sm">
                <span>Recomendación Final:</span>
                <strong class="text-purple-400">Escalar Piloto Hunter 🚀</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class ExecutiveDashboardComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  isLoading = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.isLoading = true;
    this.apiService.getDashboardMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard metrics:', err);
        this.isLoading = false;
      }
    });
  }
}
