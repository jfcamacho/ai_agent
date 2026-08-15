import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IcpConfig } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-icp-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ChipModule,
    InputTextModule,
    DividerModule
  ],
  template: `
    <div class="flex flex-column gap-4">
      
      <!-- Top Bar -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Configuración del ICP & Guardrails</h1>
            <p-tag value="Módulo M01" severity="info"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Define los criterios comerciales versionados, ponderaciones de scoring y lista negra de exclusión (Blacklist).
          </p>
        </div>

        <div class="flex align-items-center gap-2">
          <span class="text-xs text-color-secondary surface-ground px-3 py-2 border-round-xl border-1 surface-border">
            Versión Activa: <strong class="text-white font-mono">v{{ config?.version || 1 }}.0</strong>
          </span>
          <p-button
            label="Guardar Cambios"
            icon="pi pi-save"
            severity="primary"
            size="small"
            [loading]="isSaving"
            (onClick)="saveConfig()"
          ></p-button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <!-- Config Grid (PrimeFlex) -->
      <div *ngIf="!isLoading && config" class="grid">
        
        <!-- Target Industries -->
        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border h-full flex flex-column justify-content-between gap-3">
            <div>
              <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                <i class="pi pi-building text-primary"></i>
                <span>Industrias y Sectores Prioritarios</span>
              </h3>
              <p class="text-xs text-color-secondary mt-1 mb-3">Sectores donde Inter.mx enfoca el hunting de distribución B2B2C.</p>
              
              <div class="flex flex-wrap gap-2">
                <p-chip
                  *ngFor="let ind of config.targetIndustries; let i = index"
                  [label]="ind"
                  [removable]="true"
                  (onRemove)="removeIndustry(i)"
                ></p-chip>
              </div>
            </div>

            <div class="flex gap-2 pt-3 border-top-1 surface-border">
              <input
                type="text"
                pInputText
                [(ngModel)]="newIndustry"
                placeholder="Nueva industria (ej: EdTech, Insurtech)..."
                class="w-full text-xs p-2"
                (keyup.enter)="addIndustry()"
              />
              <p-button label="Agregar" icon="pi pi-plus" size="small" [outlined]="true" severity="secondary" (onClick)="addIndustry()"></p-button>
            </div>
          </div>
        </div>

        <!-- Target Roles -->
        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border h-full flex flex-column justify-content-between gap-3">
            <div>
              <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                <i class="pi pi-users text-primary"></i>
                <span>Cargos y Decisores Objetivo (M06)</span>
              </h3>
              <p class="text-xs text-color-secondary mt-1 mb-3">Perfiles clave buscados por el Agente de IA para contacto.</p>

              <div class="flex flex-wrap gap-2">
                <p-chip
                  *ngFor="let role of config.targetDecisionMakerRoles; let i = index"
                  [label]="role"
                  [removable]="true"
                  (onRemove)="removeRole(i)"
                ></p-chip>
              </div>
            </div>

            <div class="flex gap-2 pt-3 border-top-1 surface-border">
              <input
                type="text"
                pInputText
                [(ngModel)]="newRole"
                placeholder="Nuevo cargo objetivo (ej: VP Growth)..."
                class="w-full text-xs p-2"
                (keyup.enter)="addRole()"
              />
              <p-button label="Agregar" icon="pi pi-plus" size="small" [outlined]="true" severity="secondary" (onClick)="addRole()"></p-button>
            </div>
          </div>
        </div>

        <!-- Blacklist & Exclusions (Guardrail 7.1) -->
        <div class="col-12">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border border-left-3 border-rose-500 flex flex-column gap-3">
            <div class="flex justify-content-between align-items-center">
              <div>
                <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                  <i class="pi pi-ban text-rose-400"></i>
                  <span>Lista de Exclusiones Obligatorias / Blacklist (Guardrail 7.1)</span>
                </h3>
                <p class="text-xs text-color-secondary mt-1 m-0">
                  Dominios y empresas bloqueadas de inmediato para prevenir contactos indebidos o invasivos.
                </p>
              </div>
              <p-tag value="Bloqueo Determinístico Activo" severity="danger"></p-tag>
            </div>

            <div class="flex flex-wrap gap-2 my-2">
              <p-chip
                *ngFor="let domain of config.blacklistedDomains; let i = index"
                [label]="domain"
                [removable]="true"
                styleClass="bg-rose-950 text-rose-300 border-1 border-rose-800"
                (onRemove)="removeBlacklist(i)"
              ></p-chip>
            </div>

            <div class="flex gap-2 pt-2">
              <input
                type="text"
                pInputText
                [(ngModel)]="newBlacklistDomain"
                placeholder="Dominio o empresa a excluir (ej: gnp.com.mx)..."
                class="w-full text-xs p-2"
                (keyup.enter)="addBlacklist()"
              />
              <p-button label="Bloquear Dominio" icon="pi pi-lock" severity="danger" size="small" (onClick)="addBlacklist()"></p-button>
            </div>
          </div>
        </div>

        <!-- Scoring Weights -->
        <div class="col-12">
          <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column gap-3">
            <div>
              <h3 class="text-base font-bold text-white m-0 flex align-items-center gap-2">
                <i class="pi pi-sliders-h text-primary"></i>
                <span>Ponderación de Dimensiones de Scoring (M05)</span>
              </h3>
              <p class="text-xs text-color-secondary mt-1 m-0">Distribución de pesos porcentuales para el cálculo del score (0-100 pts).</p>
            </div>

            <div class="grid pt-2">
              <div class="col-12 sm:col-6 md:col-3">
                <div class="surface-ground p-3 border-round-xl border-1 surface-border">
                  <span class="text-xs text-color-secondary block mb-1">Alineación ICP (Fit):</span>
                  <div class="flex justify-content-between align-items-baseline">
                    <span class="text-2xl font-bold text-primary">{{ (config.weights.icpFit * 100).toFixed(0) }}%</span>
                    <span class="text-xs text-color-secondary">Max 30 pts</span>
                  </div>
                </div>
              </div>

              <div class="col-12 sm:col-6 md:col-3">
                <div class="surface-ground p-3 border-round-xl border-1 surface-border">
                  <span class="text-xs text-color-secondary block mb-1">Potencial B2B2C:</span>
                  <div class="flex justify-content-between align-items-baseline">
                    <span class="text-2xl font-bold text-cyan-400">{{ (config.weights.b2b2cPotential * 100).toFixed(0) }}%</span>
                    <span class="text-xs text-color-secondary">Max 30 pts</span>
                  </div>
                </div>
              </div>

              <div class="col-12 sm:col-6 md:col-3">
                <div class="surface-ground p-3 border-round-xl border-1 surface-border">
                  <span class="text-xs text-color-secondary block mb-1">Madurez Digital:</span>
                  <div class="flex justify-content-between align-items-baseline">
                    <span class="text-2xl font-bold text-green-400">{{ (config.weights.channelReadiness * 100).toFixed(0) }}%</span>
                    <span class="text-xs text-color-secondary">Max 20 pts</span>
                  </div>
                </div>
              </div>

              <div class="col-12 sm:col-6 md:col-3">
                <div class="surface-ground p-3 border-round-xl border-1 surface-border">
                  <span class="text-xs text-color-secondary block mb-1">Presencia y Escala:</span>
                  <div class="flex justify-content-between align-items-baseline">
                    <span class="text-2xl font-bold text-purple-400">{{ (config.weights.marketPresence * 100).toFixed(0) }}%</span>
                    <span class="text-xs text-color-secondary">Max 20 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class IcpConfigComponent implements OnInit {
  config: IcpConfig | null = null;
  isLoading = false;
  isSaving = false;

  newIndustry = '';
  newRole = '';
  newBlacklistDomain = '';

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    this.isLoading = true;
    this.apiService.getIcpConfig().subscribe({
      next: (cfg) => {
        this.config = cfg;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching ICP config:', err);
        this.isLoading = false;
      }
    });
  }

  addIndustry(): void {
    if (!this.newIndustry.trim() || !this.config) return;
    this.config.targetIndustries.push(this.newIndustry.trim());
    this.newIndustry = '';
  }

  removeIndustry(index: number): void {
    if (!this.config) return;
    this.config.targetIndustries.splice(index, 1);
  }

  addRole(): void {
    if (!this.newRole.trim() || !this.config) return;
    this.config.targetDecisionMakerRoles.push(this.newRole.trim());
    this.newRole = '';
  }

  removeRole(index: number): void {
    if (!this.config) return;
    this.config.targetDecisionMakerRoles.splice(index, 1);
  }

  addBlacklist(): void {
    if (!this.newBlacklistDomain.trim() || !this.config) return;
    this.config.blacklistedDomains.push(this.newBlacklistDomain.trim().toLowerCase());
    this.newBlacklistDomain = '';
  }

  removeBlacklist(index: number): void {
    if (!this.config) return;
    this.config.blacklistedDomains.splice(index, 1);
  }

  saveConfig(): void {
    if (!this.config) return;
    this.isSaving = true;
    this.apiService.updateIcpConfig(this.config).subscribe({
      next: (updated) => {
        this.config = updated;
        this.isSaving = false;
        alert('Configuración de ICP y Guardrails actualizada correctamente.');
      },
      error: (err) => {
        this.isSaving = false;
        alert(`Error al guardar configuración: ${err.error?.message || err.message}`);
      }
    });
  }
}
