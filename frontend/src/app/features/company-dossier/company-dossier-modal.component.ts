import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { Company, Lead } from '../../core/models';

@Component({
  selector: 'app-company-dossier-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    DividerModule,
    ChipModule
  ],
  template: `
    <p-dialog
      [(visible)]="isOpen"
      [modal]="true"
      [style]="{ width: '90vw', maxWidth: '950px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="close()"
    >
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-3">
          <div class="w-3rem h-3rem border-round-xl bg-primary flex align-items-center justify-content-center text-xl font-bold text-white shadow-2">
            {{ company?.name?.charAt(0) || 'E' }}
          </div>
          <div>
            <div class="flex align-items-center gap-2">
              <h2 class="text-xl font-bold m-0 text-white">{{ company?.name }}</h2>
              <p-tag
                [value]="(lead?.evaluation?.recommendation || 'EVALUADO') + ' (' + (lead?.evaluation?.totalScore || 0) + '/100)'"
                [severity]="getTagSeverity(lead?.evaluation?.recommendation)"
              ></p-tag>
            </div>
            <span class="text-xs text-color-secondary mt-1 block">
              {{ company?.legalName || company?.domain }} · {{ company?.industry }} · {{ company?.headquarters }}
            </span>
          </div>
        </div>
      </ng-template>

      <div class="flex flex-column gap-4 py-2">
        
        <!-- Key Metrics Cards (PrimeFlex grid) -->
        <div class="grid">
          <div class="col-12 sm:col-6 md:col-3">
            <div class="surface-card p-3 border-round-xl border-1 surface-border">
              <span class="text-xs text-color-secondary font-semibold uppercase block">Modelo de Negocio</span>
              <span class="text-base font-bold text-white mt-1 block">{{ company?.businessModel || 'B2B2C' }}</span>
            </div>
          </div>
          <div class="col-12 sm:col-6 md:col-3">
            <div class="surface-card p-3 border-round-xl border-1 surface-border">
              <span class="text-xs text-color-secondary font-semibold uppercase block">Empleados Estimados</span>
              <span class="text-base font-bold text-white mt-1 block">{{ company?.estimatedEmployees || 'N/D' }}</span>
            </div>
          </div>
          <div class="col-12 sm:col-6 md:col-3">
            <div class="surface-card p-3 border-round-xl border-1 surface-border">
              <span class="text-xs text-color-secondary font-semibold uppercase block">Base de Clientes</span>
              <span class="text-base font-bold text-white mt-1 block">{{ company?.estimatedUserBase || 'N/D' }}</span>
            </div>
          </div>
          <div class="col-12 sm:col-6 md:col-3">
            <div class="surface-card p-3 border-round-xl border-1 surface-border">
              <span class="text-xs text-color-secondary font-semibold uppercase block">Afinidad de Seguros</span>
              <span class="text-base font-bold text-cyan-400 mt-1 block">{{ formatAffinity(company?.insuranceAffinityCategory) }}</span>
            </div>
          </div>
        </div>

        <!-- Strategic Prospecting Brief Box -->
        <div class="surface-card p-4 border-round-xl border-1 surface-border">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="text-xs font-bold text-color-secondary uppercase tracking-wider m-0">
              📋 Tesis de Prospección Estratégica & Valor de Alianza (IA)
            </h3>
            <p-tag value="Inteligencia B2B2C Generativa" severity="info" styleClass="text-[10px]"></p-tag>
          </div>
          <div class="text-sm text-slate-200 line-height-3 m-0 bg-slate-900/70 p-4 border-round-lg border-1 surface-border overflow-x-auto" [innerHTML]="formatMarkdown(company?.description)">
          </div>
        </div>

        <!-- Explainable Scoring Dimensions (M05) -->
        <div class="surface-card p-4 border-round-xl border-1 surface-border">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="text-xs font-bold text-color-secondary uppercase tracking-wider m-0">Desglose de Scoring Explicable (0 - 100)</h3>
            <span class="text-xs text-color-secondary">Versión Evaluador: {{ lead?.evaluation?.evaluatorVersion || '2.0' }}</span>
          </div>

          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="surface-ground p-3 border-round-lg border-1 surface-border">
                <div class="flex justify-content-between text-xs font-semibold mb-2">
                  <span>Alineación con ICP (Max 30)</span>
                  <span class="text-primary font-bold">{{ lead?.evaluation?.icpFit?.score }}/30 pts</span>
                </div>
                <p-progressbar [value]="((lead?.evaluation?.icpFit?.score || 0) / 30) * 100" [showValue]="false"></p-progressbar>
                <span class="text-xs text-color-secondary mt-2 block">{{ lead?.evaluation?.icpFit?.reasoning }}</span>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="surface-ground p-3 border-round-lg border-1 surface-border">
                <div class="flex justify-content-between text-xs font-semibold mb-2">
                  <span>Potencial Comercial B2B2C (Max 30)</span>
                  <span class="text-cyan-400 font-bold">{{ lead?.evaluation?.b2b2cPotential?.score }}/30 pts</span>
                </div>
                <p-progressbar [value]="((lead?.evaluation?.b2b2cPotential?.score || 0) / 30) * 100" [showValue]="false"></p-progressbar>
                <span class="text-xs text-color-secondary mt-2 block">{{ lead?.evaluation?.b2b2cPotential?.reasoning }}</span>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="surface-ground p-3 border-round-lg border-1 surface-border">
                <div class="flex justify-content-between text-xs font-semibold mb-2">
                  <span>Madurez de Canal Digital (Max 20)</span>
                  <span class="text-green-400 font-bold">{{ lead?.evaluation?.channelReadiness?.score }}/20 pts</span>
                </div>
                <p-progressbar [value]="((lead?.evaluation?.channelReadiness?.score || 0) / 20) * 100" [showValue]="false"></p-progressbar>
                <span class="text-xs text-color-secondary mt-2 block">{{ lead?.evaluation?.channelReadiness?.reasoning }}</span>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="surface-ground p-3 border-round-lg border-1 surface-border">
                <div class="flex justify-content-between text-xs font-semibold mb-2">
                  <span>Presencia y Escala (Max 20)</span>
                  <span class="text-purple-400 font-bold">{{ lead?.evaluation?.marketPresence?.score }}/20 pts</span>
                </div>
                <p-progressbar [value]="((lead?.evaluation?.marketPresence?.score || 0) / 20) * 100" [showValue]="false"></p-progressbar>
                <span class="text-xs text-color-secondary mt-2 block">{{ lead?.evaluation?.marketPresence?.reasoning }}</span>
              </div>
            </div>
          </div>

          <!-- Overall Justification -->
          <div class="mt-3 p-3 surface-ground border-round-lg border-1 surface-border">
            <span class="text-xs font-bold text-primary block mb-1">Justificación del Agente:</span>
            <div class="text-xs text-slate-300 line-height-3 m-0" [innerHTML]="formatMarkdown(lead?.evaluation?.overallJustification)"></div>
          </div>
        </div>

        <!-- Decision Makers (M06) -->
        <div class="surface-card p-4 border-round-xl border-1 surface-border">
          <h3 class="text-xs font-bold text-color-secondary uppercase tracking-wider mb-3">Decisores Identificados (M06)</h3>
          <div class="flex flex-column gap-2">
            <div *ngFor="let dm of company?.decisionMakers" class="surface-ground p-3 border-round-lg border-1 surface-border flex justify-content-between align-items-center">
              <div class="flex align-items-center gap-3">
                <div class="w-2rem h-2rem border-circle bg-blue-900 text-blue-300 flex align-items-center justify-content-center font-bold text-xs">
                  {{ dm.name.charAt(0) }}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white m-0">{{ dm.name }}</h4>
                  <span class="text-xs text-color-secondary">{{ dm.role }} · {{ dm.department }}</span>
                </div>
              </div>
              <div class="flex align-items-center gap-2">
                <p-tag *ngIf="dm.isVerified" value="Verificado" severity="success"></p-tag>
                <a *ngIf="dm.linkedinUrl" [href]="dm.linkedinUrl" target="_blank" class="text-xs text-primary font-bold no-underline hover:underline">
                  LinkedIn <i class="pi pi-external-link text-xs"></i>
                </a>
                <span *ngIf="dm.email" class="text-xs text-color-secondary font-mono">{{ dm.email }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Signals and Traceability -->
        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="surface-card p-4 border-round-xl border-1 surface-border h-full">
              <h3 class="text-xs font-bold text-color-secondary uppercase tracking-wider mb-3">Señales de Negocio</h3>
              <div class="flex flex-column gap-2">
                <div *ngFor="let signal of company?.signals" class="surface-ground p-2 border-round-lg border-1 surface-border">
                  <div class="flex justify-content-between text-xs mb-1">
                    <span class="font-bold text-cyan-400">{{ signal.title }}</span>
                    <span class="text-color-secondary">{{ signal.dateObserved }}</span>
                  </div>
                  <span class="text-xs text-color-secondary block">{{ signal.description }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="surface-card p-4 border-round-xl border-1 surface-border h-full">
              <div class="flex justify-content-between align-items-center mb-3">
                <h3 class="text-xs font-bold text-color-secondary uppercase tracking-wider m-0">Fuentes y Trazabilidad (7.1)</h3>
                <p-tag value="🌐 Web Scraping en Vivo" severity="success" styleClass="text-[10px]"></p-tag>
              </div>
              <div class="flex flex-column gap-2">
                <div *ngFor="let source of company?.sources" class="surface-ground p-2.5 border-round-lg border-1 surface-border flex justify-content-between align-items-center">
                  <div>
                    <span class="text-xs font-bold text-white block">{{ source.name }}</span>
                    <span class="text-xs text-color-secondary">Verificado: {{ source.retrievedAt }}</span>
                  </div>
                  <a [href]="source.url" target="_blank" class="text-xs text-primary font-bold no-underline hover:underline flex align-items-center gap-1">
                    Abrir URL <i class="pi pi-external-link text-xs"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-between align-items-center w-full">
          <span class="text-xs text-color-secondary">ID: {{ company?.id }}</span>
          <div class="flex gap-2">
            <p-button label="Cerrar" icon="pi pi-times" [outlined]="true" severity="secondary" (onClick)="close()"></p-button>
            <p-button label="Redactar Contacto con IA" icon="pi pi-send" severity="primary" (onClick)="onOpenComposer()"></p-button>
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class CompanyDossierModalComponent {
  @Input() isOpen = false;
  @Input() company: Company | null = null;
  @Input() lead: Lead | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() openComposerEvent = new EventEmitter<Lead>();

  close(): void {
    this.closeEvent.emit();
  }

  onOpenComposer(): void {
    if (this.lead) {
      this.openComposerEvent.emit(this.lead);
    }
  }

  formatAffinity(category?: string): string {
    if (!category) return 'Distribución General';
    return category.replace(/_/g, ' ');
  }

  getTagSeverity(rec?: string): 'success' | 'warn' | 'danger' | 'info' {
    if (rec === 'PRIORITIZE') return 'success';
    if (rec === 'REVIEW') return 'warn';
    if (rec === 'DISCARD') return 'danger';
    return 'info';
  }

  formatMarkdown(text?: string): string {
    if (!text) return '<span class="text-color-secondary italic">Sin información disponible</span>';

    // Format headers
    let formatted = text
      .replace(/^### (.*$)/gim, '<h4 class="text-base font-bold text-cyan-400 mt-3 mb-2 flex align-items-center gap-2"><span class="text-primary">▶</span> $1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-4 mb-2 pb-1 border-bottom-1 surface-border">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-4 mb-2">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 text-slate-300 mb-1">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-slate-300 mb-1">$1</li>')
      .replace(/^---$/gim, '<hr class="border-top-1 surface-border my-3"/>')
      .replace(/\n\n/g, '<div class="my-2.5"></div>')
      .replace(/\n/g, '<br/>');

    return formatted;
  }
}
