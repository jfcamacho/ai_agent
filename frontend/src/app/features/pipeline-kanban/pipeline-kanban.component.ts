import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Lead } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

interface KanbanColumn {
  title: string;
  key: string;
  severity: 'info' | 'success' | 'warn' | 'danger' | 'secondary';
  leads: Lead[];
}

@Component({
  selector: 'app-pipeline-kanban',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Action Bar -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Pipeline Comercial de Alianzas</h1>
            <p-tag value="Vista Kanban" severity="info"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Flujo de conversión integral desde el descubrimiento automático hasta la cita calificada confirmada.
          </p>
        </div>

        <p-button label="Actualizar Pipeline" icon="pi pi-refresh" [outlined]="true" severity="secondary" size="small" (onClick)="loadLeads()"></p-button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <!-- Kanban Board (PrimeFlex grid) -->
      <div *ngIf="!isLoading" class="grid overflow-x-auto pb-4">
        <div *ngFor="let col of columns" class="col-12 md:col-6 lg:col">
          <div class="surface-card p-3 border-round-2xl border-1 surface-border min-h-full flex flex-column gap-3">
            
            <!-- Column Header -->
            <div class="flex justify-content-between align-items-center pb-2 border-bottom-1 surface-border">
              <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">{{ col.title }}</span>
              <p-tag [value]="col.leads.length.toString()" [severity]="col.severity"></p-tag>
            </div>

            <!-- Leads List in Column -->
            <div class="flex flex-column gap-2 flex-1">
              <div *ngFor="let lead of col.leads" class="surface-ground p-3 border-round-xl border-1 surface-border hover:border-primary transition-all cursor-pointer">
                <div class="flex justify-content-between align-items-start mb-2">
                  <div>
                    <h4 class="text-sm font-bold text-white m-0">{{ lead.companyName }}</h4>
                    <span class="text-xs text-color-secondary">{{ lead.industry }} · {{ lead.businessModel }}</span>
                  </div>
                  <span class="text-xs font-bold text-green-400">{{ lead.evaluation?.totalScore || 0 }} pts</span>
                </div>

                <div class="text-xs text-slate-300 mb-2">
                  <span class="text-color-secondary text-[11px] block">Decisor:</span>
                  {{ lead.primaryContact?.name || 'Alianzas Estratégicas' }}
                </div>

                <div class="flex justify-content-between align-items-center text-[10px] text-color-secondary pt-2 border-top-1 surface-border">
                  <span>{{ formatDate(lead.updatedAt) }}</span>
                  <span class="font-mono text-cyan-400">{{ lead.status }}</span>
                </div>
              </div>

              <div *ngIf="col.leads.length === 0" class="h-8rem flex align-items-center justify-content-center border-2 border-dashed surface-border border-round-xl text-xs text-color-secondary">
                Sin prospectos
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  `
})
export class PipelineKanbanComponent implements OnInit {
  leads: Lead[] = [];
  isLoading = false;
  columns: KanbanColumn[] = [];

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    this.isLoading = true;
    this.apiService.getLeads().subscribe({
      next: (data) => {
        this.leads = data;
        this.buildColumns();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error in kanban:', err);
        this.isLoading = false;
      }
    });
  }

  buildColumns(): void {
    this.columns = [
      {
        title: '1. Descubierto',
        key: 'DISCOVERED',
        severity: 'info',
        leads: this.leads.filter(l => l.status === 'DISCOVERED' || l.status === 'ENRICHED')
      },
      {
        title: '2. Aprobado',
        key: 'APPROVED',
        severity: 'success',
        leads: this.leads.filter(l => l.status === 'APPROVED_BY_HUNTER' || l.status === 'OUTREACH_GENERATED')
      },
      {
        title: '3. Contactado',
        key: 'CONTACTED',
        severity: 'warn',
        leads: this.leads.filter(l => l.status === 'CONTACTED')
      },
      {
        title: '4. Respuesta +',
        key: 'POSITIVE_REPLY',
        severity: 'info',
        leads: this.leads.filter(l => l.status === 'POSITIVE_REPLY')
      },
      {
        title: '5. Cita Agendada 🎯',
        key: 'MEETING_SCHEDULED',
        severity: 'success',
        leads: this.leads.filter(l => l.status === 'MEETING_SCHEDULED')
      }
    ];
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  }
}
