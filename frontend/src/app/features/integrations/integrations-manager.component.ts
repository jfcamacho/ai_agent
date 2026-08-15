import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IntegrationConfig, PeopleSearchResult } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-integrations-manager',
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
    <div class="flex flex-column gap-5">
      
      <!-- Top Header -->
      <div class="surface-card p-4 border-round-2xl border-1 surface-border flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2">
            <h1 class="text-2xl font-bold text-white m-0">Conectores & APIs de Prospección B2B</h1>
            <p-tag value="Capacidad M06: Decisores" severity="info" icon="pi pi-key"></p-tag>
          </div>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Gestiona tus claves de API para Apollo.io, LinkedIn Enterprise, Hunter.io y localiza personas reales por nombre, cargo o departamento.
          </p>
        </div>

        <div class="flex align-items-center gap-2">
          <p-button label="Actualizar Estado" icon="pi pi-refresh" [outlined]="true" severity="secondary" size="small" (onClick)="loadIntegrations()"></p-button>
        </div>
      </div>

      <!-- SECTION 1: Buscador en Vivo de Personas y Decisores -->
      <div class="surface-card p-4 md:p-5 border-round-2xl border-1 surface-border border-left-3 border-cyan-400 flex flex-column gap-4 shadow-3">
        <div>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-search text-xl text-cyan-400"></i>
            <h2 class="text-lg font-bold text-white m-0">Buscador en Vivo de Personas y Decisores (LinkedIn / Apollo / Google X-Ray)</h2>
          </div>
          <p class="text-xs text-slate-300 mt-1 m-0">
            Busca por <strong>tu propio nombre</strong>, por <strong>cargo o área</strong>, o por <strong>empresa</strong>. Los enlaces te redirigen a los perfiles reales en LinkedIn y a la indexación X-Ray de Google.
          </p>
        </div>

        <!-- Quick Presets -->
        <div class="flex flex-column gap-1">
          <span class="text-xs font-bold text-color-secondary uppercase">Consultas Frecuentes Rápidas:</span>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let p of searchPresets"
              (click)="applySearchPreset(p)"
              class="surface-ground px-3 py-1.5 border-round-xl border-1 surface-border text-xs font-semibold text-primary cursor-pointer hover:border-primary transition-all"
            >
              🏢 {{ p.company }} · <strong>{{ p.role }}</strong>
            </span>
          </div>
        </div>

        <!-- Search Form (PrimeFlex grid) -->
        <div class="grid align-items-end">
          <div class="col-12 md:col-4">
            <label class="text-xs font-bold text-white block mb-1">Empresa o Dominio *</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="searchCompany"
              placeholder="Ej. inter.mx, Inter Protección, clara.com..."
              class="w-full"
            />
          </div>

          <div class="col-12 md:col-4">
            <label class="text-xs font-bold text-white block mb-1">Nombre de la Persona (Opcional)</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="searchPersonName"
              placeholder="Ej. Santiago Romero, tu nombre o el del directivo..."
              class="w-full"
            />
          </div>

          <div class="col-12 md:col-2">
            <label class="text-xs font-bold text-white block mb-1">Área o Cargo</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="searchRole"
              placeholder="Ej. Administración, Alianzas..."
              class="w-full"
            />
          </div>

          <div class="col-12 md:col-2">
            <p-button
              label="Buscar"
              icon="pi pi-search"
              severity="primary"
              styleClass="w-full"
              [loading]="isSearchingPeople"
              [disabled]="!searchCompany"
              (onClick)="executePeopleSearch()"
            ></p-button>
          </div>
        </div>

        <!-- Direct LinkedIn Search Shortcut Buttons -->
        <div class="surface-ground p-3 border-round-xl border-1 surface-border flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xs text-slate-300 font-medium">
            Acceso directo a los empleados reales de <strong>{{ searchCompany }}</strong> en LinkedIn:
          </span>
          <div class="flex flex-wrap gap-2">
            <a
              [href]="getDirectLinkedInSearchUrl()"
              target="_blank"
              class="no-underline px-3 py-1.5 border-round-lg bg-blue-900/60 text-cyan-300 border-1 border-blue-700 text-xs font-bold hover:bg-blue-800 transition-all flex align-items-center gap-1.5"
            >
              <i class="pi pi-linkedin"></i>
              <span>Abrir Búsqueda en Vivo en LinkedIn</span>
            </a>

            <a
              [href]="getGoogleXraySearchUrl()"
              target="_blank"
              class="no-underline px-3 py-1.5 border-round-lg bg-slate-800 text-amber-300 border-1 border-slate-700 text-xs font-bold hover:bg-slate-700 transition-all flex align-items-center gap-1.5"
            >
              <i class="pi pi-google"></i>
              <span>Ver en Google X-Ray</span>
            </a>
          </div>
        </div>

        <!-- Search Results View -->
        <div *ngIf="isSearchingPeople" class="text-center py-6 flex flex-column align-items-center gap-3">
          <i class="pi pi-spin pi-spinner text-4xl text-cyan-400"></i>
          <p class="text-xs text-color-secondary m-0">Consultando APIs de prospección B2B y perfiles corporativos...</p>
        </div>

        <div *ngIf="!isSearchingPeople && searched && peopleResults.length > 0" class="flex flex-column gap-3 pt-2">
          <div class="flex justify-content-between align-items-center">
            <span class="text-xs font-bold text-white">
              Se identificaron <strong class="text-cyan-400">{{ peopleResults.length }}</strong> perfiles y decisores vinculados a <strong>{{ searchCompany }}</strong>:
            </span>
            <div class="flex gap-2">
              <p-tag *ngFor="let prov of providersUsed" [value]="prov" severity="secondary" styleClass="text-[10px]"></p-tag>
            </div>
          </div>

          <!-- People Cards Grid -->
          <div class="grid">
            <div *ngFor="let person of peopleResults" class="col-12 md:col-6 lg:col-4">
              <div class="surface-ground p-4 border-round-xl border-1 surface-border h-full flex flex-column justify-content-between gap-3 hover:border-cyan-400 transition-all">
                
                <div>
                  <div class="flex justify-content-between align-items-start gap-2 mb-2">
                    <div class="flex align-items-center gap-3">
                      <div class="w-2.5rem h-2.5rem border-round-lg bg-cyan-950 text-cyan-400 border-1 border-cyan-800 flex align-items-center justify-content-center font-bold text-sm">
                        {{ person.name.charAt(0) }}
                      </div>
                      <div>
                        <h4 class="text-sm font-bold text-white m-0">{{ person.name }}</h4>
                        <span class="text-[11px] text-color-secondary font-semibold block">{{ person.seniority || 'Directivo' }}</span>
                      </div>
                    </div>

                    <p-tag [value]="person.sourceProvider" [severity]="getProviderSeverity(person.sourceProvider)" styleClass="text-[9px]"></p-tag>
                  </div>

                  <!-- Headline & Role -->
                  <div class="my-2">
                    <strong class="text-xs text-cyan-300 block mb-0.5">{{ person.role }}</strong>
                    <span class="text-xs text-slate-300 block line-height-2">{{ person.headline || person.department }}</span>
                    <span *ngIf="person.location" class="text-[11px] text-color-secondary mt-1 block">
                      📍 {{ person.location }}
                    </span>
                  </div>

                  <!-- Email Box -->
                  <div class="surface-card p-2 border-round-lg border-1 surface-border my-2 flex justify-content-between align-items-center">
                    <span class="text-xs font-mono text-slate-200 text-truncate">{{ person.email || 'Email no disponible' }}</span>
                    <p-tag *ngIf="person.isVerified" value="✓ Patrón Verificado" severity="success" styleClass="text-[9px]"></p-tag>
                  </div>
                </div>

                <!-- Footer Action Buttons (Real Working Links) -->
                <div class="flex flex-column gap-2 pt-2 border-top-1 surface-border">
                  <div class="flex justify-content-between align-items-center gap-2">
                    <a
                      *ngIf="person.linkedinUrl"
                      [href]="person.linkedinUrl"
                      target="_blank"
                      class="no-underline text-xs text-cyan-400 font-bold hover:underline flex align-items-center gap-1"
                    >
                      <i class="pi pi-linkedin"></i>
                      <span>Buscar en LinkedIn</span>
                    </a>

                    <a
                      *ngIf="person.googleXrayUrl"
                      [href]="person.googleXrayUrl"
                      target="_blank"
                      class="no-underline text-xs text-amber-400 font-bold hover:underline flex align-items-center gap-1"
                    >
                      <i class="pi pi-google"></i>
                      <span>Google X-Ray</span>
                    </a>
                  </div>

                  <div class="flex justify-content-between align-items-center text-[10px] text-color-secondary">
                    <span>Confianza: <strong>{{ (person.confidenceScore * 100).toFixed(0) }}%</strong></span>
                    <a
                      *ngIf="person.companyDirectoryUrl"
                      [href]="person.companyDirectoryUrl"
                      target="_blank"
                      class="no-underline text-slate-400 hover:text-white"
                    >
                      Ver Organigrama ↗
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!isSearchingPeople && searched && peopleResults.length === 0" class="surface-ground p-4 border-round-xl border-1 surface-border text-center">
          <i class="pi pi-info-circle text-2xl text-color-secondary mb-2"></i>
          <p class="text-xs text-color-secondary m-0">No se encontraron perfiles específicos. Intenta con otro término general (ej. <em>Alianzas</em> o <em>Operaciones</em>).</p>
        </div>
      </div>

      <!-- SECTION 2: Gestor de Conectores & APIs Configuradas -->
      <div>
        <div class="mb-3">
          <h2 class="text-lg font-bold text-white m-0 flex align-items-center gap-2">
            <i class="pi pi-sliders-h text-primary"></i>
            <span>Proveedores B2B & Claves de API</span>
          </h2>
          <p class="text-xs text-color-secondary mt-1 m-0">
            Ingresa tus API Keys para activar el enriquecimiento en vivo o mantén el modo Sandbox Mock sin costo.
          </p>
        </div>

        <div class="grid">
          <div *ngFor="let integration of integrations" class="col-12 md:col-6">
            <div class="surface-card p-4 border-round-2xl border-1 surface-border h-full flex flex-column justify-content-between gap-3 shadow-2">
              
              <div>
                <!-- Header -->
                <div class="flex justify-content-between align-items-start gap-2 mb-2">
                  <div class="flex align-items-center gap-3">
                    <div class="w-3rem h-3rem border-round-xl bg-blue-900/40 text-primary border-1 border-blue-800 flex align-items-center justify-content-center text-xl font-bold">
                      <i class="pi" [ngClass]="getProviderIcon(integration.provider)"></i>
                    </div>
                    <div>
                      <h3 class="text-base font-bold text-white m-0">{{ integration.name }}</h3>
                      <span class="text-xs text-color-secondary">{{ integration.category }}</span>
                    </div>
                  </div>

                  <p-tag [value]="integration.status" [severity]="getStatusSeverity(integration.status)"></p-tag>
                </div>

                <p class="text-xs text-slate-300 line-height-3 my-2">
                  {{ integration.description }}
                </p>

                <!-- Features list chips -->
                <div class="flex flex-wrap gap-1 my-2">
                  <span *ngFor="let f of integration.featuresSupported" class="surface-ground px-2 py-0.5 border-round-md text-[10px] text-color-secondary border-1 surface-border">
                    ✓ {{ f }}
                  </span>
                </div>

                <!-- API Key Input -->
                <div class="mt-3">
                  <div class="flex justify-content-between align-items-center mb-1">
                    <label class="text-xs font-bold text-white">API Key / Token de Acceso</label>
                    <span class="text-[10px] text-color-secondary font-mono">{{ integration.endpointUrl }}</span>
                  </div>
                  <div class="flex gap-2">
                    <input
                      [type]="showKey[integration.id] ? 'text' : 'password'"
                      pInputText
                      [(ngModel)]="integration.apiKey"
                      placeholder="Pega tu API Key aquí (ej. apollo_live_...)"
                      class="w-full text-xs font-mono"
                    />
                    <p-button
                      [icon]="showKey[integration.id] ? 'pi pi-eye-slash' : 'pi pi-eye'"
                      [outlined]="true"
                      severity="secondary"
                      size="small"
                      (onClick)="showKey[integration.id] = !showKey[integration.id]"
                    ></p-button>
                  </div>
                </div>

                <!-- Last tested status message -->
                <div *ngIf="integration.testMessage" class="surface-ground p-2.5 border-round-lg border-1 surface-border text-[11px] text-slate-300 mt-2">
                  <span class="font-bold block text-cyan-400 mb-0.5">Último Test ({{ integration.lastTestedAt }}):</span>
                  {{ integration.testMessage }}
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="pt-3 border-top-1 surface-border flex justify-content-between align-items-center gap-2">
                <div class="flex align-items-center gap-2">
                  <label class="text-xs font-semibold text-color-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      [(ngModel)]="integration.isEnabled"
                      class="mr-1 cursor-pointer"
                    />
                    Habilitado
                  </label>
                </div>

                <div class="flex gap-2">
                  <p-button
                    label="Probar Conexión"
                    icon="pi pi-bolt"
                    [outlined]="true"
                    severity="secondary"
                    size="small"
                    [loading]="isTesting[integration.id]"
                    (onClick)="testIntegration(integration)"
                  ></p-button>

                  <p-button
                    label="Guardar"
                    icon="pi pi-check"
                    severity="primary"
                    size="small"
                    [loading]="isSaving[integration.id]"
                    (onClick)="saveIntegration(integration)"
                  ></p-button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class IntegrationsManagerComponent implements OnInit {
  integrations: IntegrationConfig[] = [];
  isLoading = false;
  isSaving: Record<string, boolean> = {};
  isTesting: Record<string, boolean> = {};
  showKey: Record<string, boolean> = {};

  // People search
  searchCompany = 'inter.mx';
  searchPersonName = '';
  searchRole = 'Área Administrativa y Finanzas';
  isSearchingPeople = false;
  searched = false;
  peopleResults: PeopleSearchResult[] = [];
  providersUsed: string[] = [];

  searchPresets = [
    { company: 'inter.mx', role: 'Área Administrativa y Finanzas' },
    { company: 'inter.mx', role: 'Dirección de Alianzas B2B2C' },
    { company: 'clara.com', role: 'VP of Partnerships & Product' },
    { company: 'storicard.com', role: 'Director de Alianzas e Inclusión' },
    { company: 'kueski.com', role: 'Head of Merchant Solutions' }
  ];

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.loadIntegrations();
  }

  loadIntegrations(): void {
    this.isLoading = true;
    this.apiService.getIntegrations().subscribe({
      next: (data) => {
        this.integrations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching integrations:', err);
        this.isLoading = false;
      }
    });
  }

  saveIntegration(integration: IntegrationConfig): void {
    this.isSaving[integration.id] = true;
    this.apiService.updateIntegration(integration.id, {
      apiKey: integration.apiKey,
      isEnabled: integration.isEnabled,
      endpointUrl: integration.endpointUrl
    }).subscribe({
      next: (updated) => {
        this.isSaving[integration.id] = false;
        const idx = this.integrations.findIndex(i => i.id === updated.id);
        if (idx !== -1) this.integrations[idx] = updated;
        alert(`Configuración de ${integration.name} guardada exitosamente.`);
      },
      error: (err) => {
        this.isSaving[integration.id] = false;
        alert(`Error al guardar: ${err.error?.message || err.message}`);
      }
    });
  }

  testIntegration(integration: IntegrationConfig): void {
    this.isTesting[integration.id] = true;
    this.apiService.testIntegration(integration.id, {
      apiKey: integration.apiKey,
      isEnabled: integration.isEnabled
    }).subscribe({
      next: (res) => {
        this.isTesting[integration.id] = false;
        const idx = this.integrations.findIndex(i => i.id === res.config.id);
        if (idx !== -1) this.integrations[idx] = res.config;
      },
      error: (err) => {
        this.isTesting[integration.id] = false;
        alert(`Error al probar: ${err.error?.message || err.message}`);
      }
    });
  }

  applySearchPreset(preset: { company: string; role: string }): void {
    this.searchCompany = preset.company;
    this.searchRole = preset.role;
    this.searchPersonName = '';
    this.executePeopleSearch();
  }

  executePeopleSearch(): void {
    if (!this.searchCompany) return;
    this.isSearchingPeople = true;
    this.searched = true;

    this.apiService.searchPeople({
      companyName: this.searchCompany,
      domain: this.searchCompany,
      personName: this.searchPersonName ? this.searchPersonName.trim() : undefined,
      roleOrDepartment: this.searchRole ? this.searchRole.trim() : undefined
    }).subscribe({
      next: (res) => {
        this.isSearchingPeople = false;
        this.peopleResults = res.people;
        this.providersUsed = res.providersQueried;
      },
      error: (err) => {
        this.isSearchingPeople = false;
        alert(`Error al buscar personas: ${err.error?.message || err.message}`);
      }
    });
  }

  getDirectLinkedInSearchUrl(): string {
    const query = `${this.searchPersonName ? this.searchPersonName + ' ' : ''}${this.searchCompany} ${this.searchRole}`.trim();
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
  }

  getGoogleXraySearchUrl(): string {
    const query = `site:linkedin.com/in "${this.searchPersonName || this.searchCompany}" "${this.searchRole}"`.trim();
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }

  getProviderIcon(provider: string): string {
    if (provider === 'APOLLO_IO') return 'pi-bolt text-amber-400';
    if (provider === 'LINKEDIN_PROXYCURL') return 'pi-linkedin text-cyan-400';
    if (provider === 'HUNTER_IO') return 'pi-envelope text-orange-400';
    return 'pi-link text-primary';
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (status === 'ACTIVE') return 'success';
    if (status === 'SANDBOX_MOCK') return 'warn';
    if (status === 'ERROR') return 'danger';
    return 'secondary';
  }

  getProviderSeverity(provider: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    if (provider === 'APOLLO_IO') return 'warn';
    if (provider === 'LINKEDIN_PROXYCURL') return 'info';
    if (provider === 'HUNTER_IO') return 'danger';
    return 'secondary';
  }
}
