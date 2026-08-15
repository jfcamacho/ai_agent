import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Company, Lead } from '../../core/models';
import { ApiService } from '../../core/services/api.service';
import { CompanyDossierModalComponent } from '../company-dossier/company-dossier-modal.component';
import { OutreachComposerModalComponent } from '../outreach-composer/outreach-composer-modal.component';

@Component({
  selector: 'app-lead-inbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ChipModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule,
    DividerModule,
    CompanyDossierModalComponent,
    OutreachComposerModalComponent
  ],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Action Bar (PrimeFlex) -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Bandeja del Hunter</h1>
            <p-tag value="Human-in-the-Loop (M07)" severity="info"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Prospectos descubiertos proactivamente por el Agente de IA, analizados y calificados según el ICP de Inter.mx.
          </p>
        </div>

        <div class="flex flex-wrap align-items-center gap-2">
          <p-button
            label="Vaciar Sandbox"
            icon="pi pi-trash"
            [outlined]="true"
            severity="danger"
            size="small"
            (onClick)="resetSandbox()"
          ></p-button>
          
          <p-button
            label="🔍 Investigar Cualquier Empresa con IA"
            icon="pi pi-search-plus"
            severity="secondary"
            size="small"
            (onClick)="openInvestigateModal()"
          ></p-button>

          <p-button
            label="Buscar Prospectos en Sector Activo"
            icon="pi pi-bolt"
            severity="primary"
            size="small"
            [loading]="isDiscovering"
            (onClick)="triggerProactiveDiscovery()"
          ></p-button>
        </div>
      </div>

      <!-- Sector Filter Bar -->
      <div class="surface-card p-3 border-round-xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div class="flex flex-wrap align-items-center gap-2">
          <span class="text-xs font-bold text-color-secondary uppercase">Sector Objetivo:</span>
          
          <button
            type="button"
            *ngFor="let s of sectors"
            (click)="selectSector(s.id)"
            [style.background-color]="selectedSector === s.id ? '#1e3a8a' : 'transparent'"
            [style.color]="selectedSector === s.id ? '#ffffff' : '#94a3b8'"
            [style.border]="selectedSector === s.id ? '1px solid #3b82f6' : '1px solid #1e293b'"
            class="px-3 py-1.5 border-round-lg text-xs font-semibold cursor-pointer transition-all hover:surface-hover"
          >
            {{ s.label }}
          </button>
        </div>

        <span class="text-xs text-color-secondary">
          Sector actual: <strong class="text-primary">{{ getSectorLabel(selectedSector) }}</strong>
        </span>
      </div>

      <!-- Filters & Counter Bar -->
      <div class="flex flex-wrap justify-content-between align-items-center gap-3 text-xs font-semibold text-color-secondary">
        <div class="flex flex-wrap align-items-center gap-2">
          <span>Filtrar por Recomendación:</span>
          <p-button
            [label]="'Todos (' + leads.length + ')'"
            [outlined]="filterRecommendation !== 'ALL'"
            severity="secondary"
            size="small"
            (onClick)="filterRecommendation = 'ALL'"
          ></p-button>
          <p-button
            [label]="'Priorizar (' + countByRecommendation('PRIORITIZE') + ')'"
            [outlined]="filterRecommendation !== 'PRIORITIZE'"
            severity="success"
            size="small"
            (onClick)="filterRecommendation = 'PRIORITIZE'"
          ></p-button>
          <p-button
            [label]="'Revisar (' + countByRecommendation('REVIEW') + ')'"
            [outlined]="filterRecommendation !== 'REVIEW'"
            severity="warn"
            size="small"
            (onClick)="filterRecommendation = 'REVIEW'"
          ></p-button>
          <p-button
            [label]="'Descartados (' + countByRecommendation('DISCARD') + ')'"
            [outlined]="filterRecommendation !== 'DISCARD'"
            severity="danger"
            size="small"
            (onClick)="filterRecommendation = 'DISCARD'"
          ></p-button>
        </div>

        <span class="text-xs text-color-secondary">
          Mostrando {{ filteredLeads.length }} prospectos en cartera
        </span>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8 flex flex-column align-items-center gap-3">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
        <p class="text-sm text-color-secondary m-0">El Agente está explorando fuentes B2B en tiempo real...</p>
      </div>

      <!-- Lead Cards Grid (PrimeFlex grid) -->
      <div *ngIf="!isLoading && filteredLeads.length > 0" class="grid">
        <div *ngFor="let lead of filteredLeads" class="col-12 md:col-6 lg:col-4">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border h-full flex flex-column justify-content-between transition-all hover:shadow-4">
            
            <div>
              <!-- Card Header -->
              <div class="flex justify-content-between align-items-start gap-2 mb-3">
                <div class="flex align-items-center gap-3">
                  <div class="w-3rem h-3rem border-round-xl bg-blue-900/40 text-primary border-1 border-blue-800/40 flex align-items-center justify-content-center text-lg font-bold">
                    {{ lead.companyName.charAt(0) }}
                  </div>
                  <div>
                    <h3 class="text-base font-bold text-white m-0 hover:text-primary cursor-pointer" (click)="openDossier(lead)">
                      {{ lead.companyName }}
                    </h3>
                    <span class="text-xs text-color-secondary block">{{ lead.domain }} · {{ lead.industry }}</span>
                  </div>
                </div>

                <div class="text-right">
                  <span class="text-lg font-bold block" [ngClass]="getScoreColor(lead.evaluation?.totalScore || 0)">
                    {{ lead.evaluation?.totalScore || 0 }}<small class="text-xs text-color-secondary font-normal">/100</small>
                  </span>
                  <p-tag
                    [value]="lead.evaluation?.recommendation || 'REVISAR'"
                    [severity]="getTagSeverity(lead.evaluation?.recommendation)"
                  ></p-tag>
                </div>
              </div>

              <!-- Metrics -->
              <div class="flex justify-content-between text-xs text-color-secondary my-2">
                <span>Modelo: <strong class="text-white">{{ lead.businessModel }}</strong></span>
                <span>Afinidad: <strong class="text-cyan-400">{{ formatAffinity(lead.insuranceAffinityCategory) }}</strong></span>
              </div>

              <!-- AI Justification Snippet -->
              <div class="surface-ground p-3 border-round-lg border-1 surface-border my-3">
                <p class="text-xs text-slate-300 line-height-3 m-0 line-clamp-2">
                  {{ lead.evaluation?.overallJustification }}
                </p>
              </div>

              <!-- Decision Maker -->
              <div class="surface-ground p-2 border-round-lg border-1 surface-border mb-3">
                <span class="text-xs text-color-secondary font-bold uppercase block mb-1">Decisor:</span>
                <div class="flex justify-content-between align-items-center text-xs">
                  <strong class="text-white">{{ lead.primaryContact?.name || 'Director de Alianzas' }}</strong>
                  <span class="text-color-secondary">{{ lead.primaryContact?.role || 'Head of Partnerships' }}</span>
                </div>
              </div>

              <!-- Status Tag -->
              <div class="flex justify-content-between align-items-center text-xs mb-3">
                <span class="text-color-secondary">Estado:</span>
                <p-tag [value]="lead.status" [severity]="getStatusSeverity(lead.status)"></p-tag>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-3 border-top-1 surface-border flex align-items-center gap-2">
              <p-button
                label="Expediente 360°"
                icon="pi pi-id-card"
                [outlined]="true"
                severity="secondary"
                size="small"
                styleClass="w-full text-xs"
                (onClick)="openDossier(lead)"
              ></p-button>

              <p-button
                *ngIf="lead.status !== 'REJECTED_BY_HUNTER' && lead.status !== 'OPT_OUT_HALTED'"
                label="Redactar"
                icon="pi pi-send"
                severity="primary"
                size="small"
                styleClass="w-full text-xs"
                (onClick)="openComposer(lead)"
              ></p-button>

              <p-button
                *ngIf="lead.status === 'DISCOVERED' || lead.status === 'ENRICHED'"
                icon="pi pi-trash"
                [text]="true"
                severity="danger"
                size="small"
                (onClick)="rejectLead(lead)"
              ></p-button>
            </div>

          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredLeads.length === 0" class="surface-card p-6 border-round-2xl border-1 surface-border text-center">
        <i class="pi pi-search text-5xl text-color-secondary mb-3"></i>
        <h3 class="text-lg font-bold text-white m-0">No hay prospectos en este sector o filtro</h3>
        <p class="text-xs text-color-secondary mt-1 mb-4">
          Haz clic en "Buscar Prospectos en Sector Activo" o "Investigar Cualquier Empresa" para que el Agente de IA detecte candidatos.
        </p>
        <div class="flex justify-content-center gap-2">
          <p-button label="Buscar Prospectos en Sector Activo" icon="pi pi-bolt" severity="primary" size="small" (onClick)="triggerProactiveDiscovery()"></p-button>
          <p-button label="🔍 Investigar Empresa Específica" icon="pi pi-search-plus" [outlined]="true" severity="secondary" size="small" (onClick)="openInvestigateModal()"></p-button>
        </div>
      </div>

      <!-- Modal: Investigar Cualquier Empresa con IA -->
      <p-dialog
        header="🔍 Investigar Cualquier Empresa Mexicana con IA"
        [(visible)]="isInvestigateModalOpen"
        [modal]="true"
        [style]="{ width: '560px' }"
        [draggable]="false"
        [resizable]="false"
      >
        <div class="flex flex-column gap-3 pt-2">
          <p class="text-xs text-color-secondary m-0">
            Ingresa el nombre o dominio de cualquier empresa en México (o selecciona un ejemplo rápido). El Agente de IA investigará su modelo comercial, estimará su tamaño, deducirá afinidad con seguros Inter.mx y calculará su scoring 0-100 pts.
          </p>

          <!-- Quick presets chips -->
          <div class="flex flex-column gap-1">
            <span class="text-xs font-bold text-color-secondary uppercase">Ejemplos Rápidos de Prueba:</span>
            <div class="flex flex-wrap gap-2">
              <span
                *ngFor="let p of quickPresets"
                (click)="applyPreset(p)"
                class="surface-card px-2.5 py-1 border-round-lg border-1 surface-border text-xs font-semibold text-primary cursor-pointer hover:border-primary transition-all"
              >
                + {{ p.name }} ({{ p.industry }})
              </span>
            </div>
          </div>

          <div class="flex flex-column gap-1">
            <label class="text-xs font-bold text-white">Nombre de la Empresa *</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="customCompany.name"
              placeholder="Ej. Bitso, Albo, Mercado Libre, Stori..."
              class="w-full"
            />
          </div>

          <div class="flex flex-column gap-1">
            <label class="text-xs font-bold text-white">Dominio Web *</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="customCompany.domain"
              placeholder="Ej. bitso.com, albo.mx..."
              class="w-full"
            />
          </div>

          <div class="flex flex-column gap-1">
            <label class="text-xs font-bold text-white">Sector / Industria (Opcional)</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="customCompany.industry"
              placeholder="Ej. Fintech, HR Tech, HealthTech, Retail..."
              class="w-full"
            />
          </div>

          <div class="flex flex-column gap-1">
            <label class="text-xs font-bold text-white">Contexto Adicional (Opcional)</label>
            <textarea
              pTextarea
              [(ngModel)]="customCompany.customContext"
              rows="2"
              placeholder="Detalles sobre su base de usuarios, productos o enfoque comercial..."
              class="w-full"
            ></textarea>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="flex justify-content-end gap-2">
            <p-button label="Cancelar" [text]="true" severity="secondary" (onClick)="isInvestigateModalOpen = false"></p-button>
            <p-button
              label="🤖 Analizar y Calificar con IA"
              icon="pi pi-sparkles"
              severity="primary"
              [loading]="isInvestigating"
              [disabled]="!customCompany.name || !customCompany.domain"
              (onClick)="executeCustomInvestigation()"
            ></p-button>
          </div>
        </ng-template>
      </p-dialog>

      <!-- Modals -->
      <app-company-dossier-modal
        [isOpen]="isDossierOpen"
        [company]="selectedCompany"
        [lead]="selectedLead"
        (closeEvent)="isDossierOpen = false"
        (openComposerEvent)="handleOpenComposerFromDossier($event)"
      ></app-company-dossier-modal>

      <app-outreach-composer-modal
        *ngIf="isComposerOpen"
        [isOpen]="isComposerOpen"
        [lead]="selectedLead"
        (closeEvent)="isComposerOpen = false"
        (sentSuccessEvent)="loadLeads()"
      ></app-outreach-composer-modal>

    </div>
  `
})
export class LeadInboxComponent implements OnInit {
  leads: Lead[] = [];
  isLoading = false;
  isDiscovering = false;
  isInvestigating = false;
  isInvestigateModalOpen = false;
  filterRecommendation = 'ALL';
  selectedSector = 'ALL';

  sectors = [
    { id: 'ALL', label: 'Todos los Sectores' },
    { id: 'Fintech', label: 'Fintech' },
    { id: 'HR Tech', label: 'HR Tech & Nómina' },
    { id: 'HealthTech', label: 'HealthTech' },
    { id: 'Retail', label: 'Retail & E-commerce' },
    { id: 'Logistics Tech', label: 'Logística' },
    { id: 'Mobility', label: 'Movilidad & Auto' }
  ];

  quickPresets = [
    { name: 'Stori Card', domain: 'storicard.com', industry: 'Fintech', context: 'Tarjeta de crédito e inclusión financiera con más de 3 millones de usuarios.' },
    { name: 'Rappi México', domain: 'rappi.com.mx', industry: 'Retail & E-commerce', context: 'SuperApp con 60,000 repartidores y millones de comensales activos.' },
    { name: 'Doctoralia México', domain: 'doctoralia.com.mx', industry: 'HealthTech', context: 'Plataforma líder de citas médicas con 5 millones de pacientes en México.' },
    { name: 'Worky.mx', domain: 'worky.mx', industry: 'HR Tech', context: 'Software de nómina y RH para PyMEs en México.' },
    { name: 'Konfío', domain: 'konfio.mx', industry: 'Fintech', context: 'Plataforma de créditos y tarjetas para 60,000 pequeñas y medianas empresas.' },
    { name: 'Bitso', domain: 'bitso.com', industry: 'Fintech', context: 'Plataforma de servicios financieros y pagos con 3 millones de usuarios.' }
  ];

  customCompany = {
    name: '',
    domain: '',
    industry: '',
    customContext: ''
  };

  isDossierOpen = false;
  isComposerOpen = false;
  selectedLead: Lead | null = null;
  selectedCompany: Company | null = null;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    this.isLoading = true;
    this.apiService.getLeads().subscribe({
      next: (data) => {
        this.leads = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching leads:', err);
        this.isLoading = false;
      }
    });
  }

  selectSector(sectorId: string): void {
    this.selectedSector = sectorId;
    this.triggerProactiveDiscovery();
  }

  getSectorLabel(sectorId: string): string {
    const s = this.sectors.find(item => item.id === sectorId);
    return s ? s.label : 'Todos';
  }

  resetSandbox(): void {
    if (!confirm('¿Estás seguro de que deseas vaciar y reiniciar el Sandbox a estado cero?')) return;
    this.isLoading = true;
    this.apiService.resetSandbox().subscribe({
      next: () => {
        this.leads = [];
        this.isLoading = false;
        alert('El Sandbox ha sido vaciado y reiniciado completamente.');
      },
      error: (err) => {
        this.isLoading = false;
        alert(`Error al vaciar: ${err.error?.message || err.message}`);
      }
    });
  }

  get filteredLeads(): Lead[] {
    let list = this.leads;
    if (this.selectedSector !== 'ALL') {
      list = list.filter(l => 
        l.industry.toLowerCase().includes(this.selectedSector.toLowerCase()) ||
        l.domain.toLowerCase().includes(this.selectedSector.toLowerCase())
      );
    }
    if (this.filterRecommendation !== 'ALL') {
      list = list.filter(l => l.evaluation?.recommendation === this.filterRecommendation);
    }
    return list;
  }

  countByRecommendation(rec: string): number {
    return this.leads.filter(l => l.evaluation?.recommendation === rec).length;
  }

  triggerProactiveDiscovery(): void {
    this.isDiscovering = true;
    this.apiService.triggerDiscovery(15, this.selectedSector).subscribe({
      next: () => {
        this.isDiscovering = false;
        this.loadLeads();
      },
      error: (err) => {
        this.isDiscovering = false;
        alert(`Error al ejecutar búsqueda: ${err.error?.message || err.message}`);
      }
    });
  }

  openInvestigateModal(): void {
    this.customCompany = { name: '', domain: '', industry: '', customContext: '' };
    this.isInvestigateModalOpen = true;
  }

  applyPreset(preset: { name: string; domain: string; industry: string; context: string }): void {
    this.customCompany.name = preset.name;
    this.customCompany.domain = preset.domain;
    this.customCompany.industry = preset.industry;
    this.customCompany.customContext = preset.context;
  }

  executeCustomInvestigation(): void {
    if (!this.customCompany.name || !this.customCompany.domain) return;
    this.isInvestigating = true;

    this.apiService.investigateCompany(this.customCompany).subscribe({
      next: (lead) => {
        this.isInvestigating = false;
        this.isInvestigateModalOpen = false;
        this.loadLeads();
      },
      error: (err) => {
        this.isInvestigating = false;
        alert(`Error al investigar empresa: ${err.error?.message || err.message}`);
      }
    });
  }

  seedDemoLeads(): void {
    this.apiService.seedDemoLeads().subscribe({
      next: () => this.loadLeads(),
      error: (err) => console.error('Seed error:', err)
    });
  }

  openDossier(lead: Lead): void {
    this.selectedLead = lead;
    this.selectedCompany = lead.companyDetails || {
      id: lead.companyId,
      name: lead.companyName,
      domain: lead.domain,
      website: `https://${lead.domain}`,
      industry: lead.industry,
      headquarters: 'México',
      country: 'México',
      estimatedEmployees: 450,
      businessModel: (lead.businessModel as any) || 'B2B2C',
      description: lead.evaluation?.overallJustification || 'Empresa evaluada por el Agente de IA.',
      productsAndServices: ['Servicios Digitales'],
      insuranceAffinityCategory: lead.insuranceAffinityCategory,
      decisionMakers: lead.primaryContact ? [lead.primaryContact] : [],
      signals: [],
      sources: [{ name: 'Directorio B2B', url: `https://${lead.domain}`, retrievedAt: '2026-08-14' }],
      discoverySource: 'AUTONOMOUS_PROACTIVE',
      discoveredAt: new Date().toISOString()
    };
    this.isDossierOpen = true;
  }

  openComposer(lead: Lead): void {
    this.selectedLead = lead;
    this.isComposerOpen = true;
  }

  handleOpenComposerFromDossier(lead: Lead): void {
    this.isDossierOpen = false;
    this.openComposer(lead);
  }

  rejectLead(lead: Lead): void {
    const reason = prompt('Motivo del descarte (opcional):', 'Fuera de foco comercial');
    this.apiService.rejectLead(lead.id, 'Santiago Romero', reason || undefined).subscribe({
      next: () => this.loadLeads(),
      error: (err) => console.error('Error rejecting lead:', err)
    });
  }

  getScoreColor(score: number): string {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  }

  getTagSeverity(rec?: string): 'success' | 'warn' | 'danger' | 'info' {
    if (rec === 'PRIORITIZE') return 'success';
    if (rec === 'REVIEW') return 'warn';
    if (rec === 'DISCARD') return 'danger';
    return 'info';
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (status === 'MEETING_SCHEDULED') return 'success';
    if (status === 'POSITIVE_REPLY' || status === 'APPROVED_BY_HUNTER') return 'info';
    if (status === 'CONTACTED') return 'warn';
    if (status === 'OPT_OUT_HALTED' || status === 'REJECTED_BY_HUNTER') return 'danger';
    return 'secondary';
  }

  formatAffinity(affinity?: string): string {
    if (!affinity) return 'General';
    return affinity.replace(/_/g, ' ');
  }
}
