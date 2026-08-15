import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuditLogsComponent } from './features/audit-logs/audit-logs.component';
import { CalendarAppointmentsComponent } from './features/calendar-appointments/calendar-appointments.component';
import { ExecutiveDashboardComponent } from './features/executive-dashboard/executive-dashboard.component';
import { IcpConfigComponent } from './features/icp-config/icp-config.component';
import { IntegrationsManagerComponent } from './features/integrations/integrations-manager.component';
import { LeadInboxComponent } from './features/lead-inbox/lead-inbox.component';
import { PipelineKanbanComponent } from './features/pipeline-kanban/pipeline-kanban.component';
import { SandboxTesterComponent } from './features/sandbox-tester/sandbox-tester.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    LeadInboxComponent,
    PipelineKanbanComponent,
    CalendarAppointmentsComponent,
    IcpConfigComponent,
    ExecutiveDashboardComponent,
    SandboxTesterComponent,
    AuditLogsComponent,
    IntegrationsManagerComponent
  ],
  template: `
    <div class="flex h-screen overflow-hidden surface-ground text-color">
      
      <!-- PrimeNG Sidebar Layout -->
      <aside class="w-18rem surface-card border-right-1 surface-border flex flex-column justify-content-between p-3 z-2">
        <div class="flex flex-column gap-4">
          
          <!-- Logo & Brand Header -->
          <div class="px-2 pt-2">
            <div class="flex align-items-center gap-3">
              <div class="w-3rem h-3rem border-round-xl bg-primary flex align-items-center justify-content-center font-bold text-xl text-white shadow-2">
                IN
              </div>
              <div>
                <h1 class="font-extrabold text-white text-lg tracking-tight m-0 line-height-1">Inter.mx</h1>
                <span class="text-xs text-primary font-bold tracking-wider uppercase">Alianzas con IA</span>
              </div>
            </div>

            <!-- Agent Autonomous Badge -->
            <div class="mt-3 p-2 surface-ground border-round-xl border-1 surface-border flex align-items-center justify-content-between">
              <div class="flex align-items-center gap-2">
                <span class="w-1rem h-1rem border-circle bg-green-500 pulse-agent inline-block"></span>
                <span class="text-xs font-semibold text-slate-200">Agente Autónomo</span>
              </div>
              <p-tag value="ONLINE" severity="success" styleClass="text-[10px]"></p-tag>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex flex-column gap-1">
            
            <button
              type="button"
              (click)="setTab('INBOX')"
              [style.background-color]="activeTab === 'INBOX' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'INBOX' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'INBOX' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-inbox text-base" [style.color]="activeTab === 'INBOX' ? '#60a5fa' : '#94a3b8'"></i>
              <span>Bandeja del Hunter</span>
            </button>

            <button
              type="button"
              (click)="setTab('PIPELINE')"
              [style.background-color]="activeTab === 'PIPELINE' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'PIPELINE' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'PIPELINE' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-th-large text-base" [style.color]="activeTab === 'PIPELINE' ? '#60a5fa' : '#94a3b8'"></i>
              <span>Pipeline Comercial</span>
            </button>

            <button
              type="button"
              (click)="setTab('CALENDAR')"
              [style.background-color]="activeTab === 'CALENDAR' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'CALENDAR' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'CALENDAR' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-calendar text-base" [style.color]="activeTab === 'CALENDAR' ? '#60a5fa' : '#94a3b8'"></i>
              <span>Citas Calificadas (M11)</span>
            </button>

            <button
              type="button"
              (click)="setTab('DASHBOARD')"
              [style.background-color]="activeTab === 'DASHBOARD' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'DASHBOARD' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'DASHBOARD' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-chart-bar text-base" [style.color]="activeTab === 'DASHBOARD' ? '#60a5fa' : '#94a3b8'"></i>
              <span>Dashboard Ejecutivo (M12)</span>
            </button>

            <button
              type="button"
              (click)="setTab('ICP')"
              [style.background-color]="activeTab === 'ICP' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'ICP' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'ICP' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-cog text-base" [style.color]="activeTab === 'ICP' ? '#60a5fa' : '#94a3b8'"></i>
              <span>ICP & Guardrails (M01)</span>
            </button>

            <button
              type="button"
              (click)="setTab('INTEGRATIONS')"
              [style.background-color]="activeTab === 'INTEGRATIONS' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'INTEGRATIONS' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'INTEGRATIONS' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-key text-base" [style.color]="activeTab === 'INTEGRATIONS' ? '#60a5fa' : '#94a3b8'"></i>
              <span>Conectores & APIs (M06)</span>
            </button>

            <button
              type="button"
              (click)="setTab('SANDBOX')"
              [style.background-color]="activeTab === 'SANDBOX' ? '#78350f' : 'transparent'"
              [style.color]="activeTab === 'SANDBOX' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'SANDBOX' ? '1px solid #f59e0b' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-shield text-base" [style.color]="activeTab === 'SANDBOX' ? '#fbbf24' : '#94a3b8'"></i>
              <span>Simulador Sandbox</span>
            </button>

            <button
              type="button"
              (click)="setTab('AUDIT')"
              [style.background-color]="activeTab === 'AUDIT' ? '#1e3a8a' : 'transparent'"
              [style.color]="activeTab === 'AUDIT' ? '#ffffff' : '#94a3b8'"
              [style.border]="activeTab === 'AUDIT' ? '1px solid #3b82f6' : '1px solid transparent'"
              class="w-full flex align-items-center gap-3 p-3 border-round-xl cursor-pointer text-left transition-all text-sm font-semibold"
            >
              <i class="pi pi-history text-base" [style.color]="activeTab === 'AUDIT' ? '#60a5fa' : '#94a3b8'"></i>
              <span>Auditoría (7.1)</span>
            </button>

          </nav>

        </div>

        <!-- Hunter User Profile -->
        <div class="p-3 surface-ground border-round-xl border-1 surface-border flex align-items-center gap-3">
          <div class="w-2rem h-2rem border-circle bg-primary flex align-items-center justify-content-center font-bold text-xs text-white">
            SR
          </div>
          <div class="overflow-hidden">
            <h4 class="text-xs font-bold text-white m-0 text-truncate">Santiago Romero</h4>
            <span class="text-[10px] text-color-secondary block text-truncate">Hunter · Alianzas B2B2C</span>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-column overflow-hidden surface-ground">
        
        <!-- Header -->
        <header class="h-4rem border-bottom-1 surface-border px-4 flex align-items-center justify-content-between surface-card">
          <div class="flex align-items-center gap-2">
            <span class="text-xs text-color-secondary uppercase font-semibold">Entorno:</span>
            <p-tag value="🛡️ Modo Sandbox Seguro (Cero Riesgo Externo)" severity="warn"></p-tag>
          </div>

          <div class="flex align-items-center gap-4 text-xs">
            <div class="flex align-items-center gap-2">
              <span class="w-1rem h-1rem border-circle bg-primary inline-block"></span>
              <span class="text-slate-300 font-medium">Backend NestJS: <strong>Port 8080</strong></span>
            </div>
            <div class="flex align-items-center gap-2">
              <span class="w-1rem h-1rem border-circle bg-cyan-400 inline-block"></span>
              <span class="text-slate-300 font-medium">Agent Service: <strong>Port 8081</strong></span>
            </div>
          </div>
        </header>

        <!-- Dynamic Body -->
        <div class="flex-1 overflow-y-auto p-4 md:p-6">
          <app-lead-inbox *ngIf="activeTab === 'INBOX'"></app-lead-inbox>
          <app-pipeline-kanban *ngIf="activeTab === 'PIPELINE'"></app-pipeline-kanban>
          <app-calendar-appointments *ngIf="activeTab === 'CALENDAR'"></app-calendar-appointments>
          <app-executive-dashboard *ngIf="activeTab === 'DASHBOARD'"></app-executive-dashboard>
          <app-icp-config *ngIf="activeTab === 'ICP'"></app-icp-config>
          <app-integrations-manager *ngIf="activeTab === 'INTEGRATIONS'"></app-integrations-manager>
          <app-sandbox-tester *ngIf="activeTab === 'SANDBOX'"></app-sandbox-tester>
          <app-audit-logs *ngIf="activeTab === 'AUDIT'"></app-audit-logs>
        </div>

      </main>

    </div>
  `
})
export class AppComponent {
  activeTab: 'INBOX' | 'PIPELINE' | 'CALENDAR' | 'DASHBOARD' | 'ICP' | 'INTEGRATIONS' | 'SANDBOX' | 'AUDIT' = 'INBOX';

  setTab(tab: 'INBOX' | 'PIPELINE' | 'CALENDAR' | 'DASHBOARD' | 'ICP' | 'INTEGRATIONS' | 'SANDBOX' | 'AUDIT'): void {
    this.activeTab = tab;
  }
}
