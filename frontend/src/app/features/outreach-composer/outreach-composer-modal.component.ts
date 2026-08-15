import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { Lead, OutreachMessage } from '../../core/models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-outreach-composer-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TagModule,
    DividerModule
  ],
  template: `
    <p-dialog
      [(visible)]="isOpen"
      [modal]="true"
      [style]="{ width: '90vw', maxWidth: '900px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="close()"
    >
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-3">
          <div class="w-3rem h-3rem border-round-xl bg-blue-900/40 text-primary flex align-items-center justify-content-center text-xl font-bold border-1 border-blue-800/50">
            <i class="pi pi-file-edit"></i>
          </div>
          <div>
            <div class="flex align-items-center gap-2">
              <h2 class="text-xl font-bold text-white m-0">Taller de Redacción & Aprobación (M08 - M09)</h2>
              <p-tag value="Modo Sandbox Seguro" severity="warn" icon="pi pi-shield"></p-tag>
            </div>
            <span class="text-xs text-color-secondary mt-1 block">
              Destinatario: {{ lead?.companyName }} · Decisor: {{ lead?.primaryContact?.name || 'Director de Alianzas' }}
            </span>
          </div>
        </div>
      </ng-template>

      <div class="py-2 flex flex-column gap-4">
        
        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-6 flex flex-column align-items-center gap-3">
          <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          <p class="text-sm text-color-secondary m-0">El Agente de IA está redactando la propuesta con Guardrails anti-alucinación...</p>
        </div>

        <div *ngIf="!isLoading && draftMessage" class="flex flex-column gap-3">
          
          <!-- Context & Value Proposition Grid -->
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="surface-card p-3 border-round-xl border-1 surface-border">
                <span class="text-xs font-bold text-primary uppercase block mb-1">Racional del Gancho (Hook):</span>
                <p class="text-xs text-slate-300 line-height-3 m-0">{{ draftMessage.hookRationale }}</p>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="surface-card p-3 border-round-xl border-1 surface-border">
                <span class="text-xs font-bold text-green-400 uppercase block mb-1">Propuesta de Valor Inter.mx:</span>
                <p class="text-xs text-slate-300 line-height-3 m-0">{{ draftMessage.valueProposition }}</p>
              </div>
            </div>
          </div>

          <!-- Subject Input -->
          <div class="flex flex-column gap-2">
            <label class="text-xs font-bold text-color-secondary uppercase tracking-wider">Asunto del Correo:</label>
            <input
              type="text"
              pInputText
              [(ngModel)]="editedSubject"
              class="w-full text-sm font-semibold p-3"
            />
          </div>

          <!-- Message Body Textarea -->
          <div class="flex flex-column gap-2">
            <div class="flex justify-content-between align-items-center">
              <label class="text-xs font-bold text-color-secondary uppercase tracking-wider">Cuerpo del Mensaje (Editable por el Hunter):</label>
              <span class="text-xs text-color-secondary">Guardrails: Sin promesas falsas · Firma obligatoria</span>
            </div>
            <textarea
              rows="10"
              pTextarea
              [(ngModel)]="editedBody"
              class="w-full text-sm line-height-3 p-3 font-sans"
            ></textarea>
          </div>

          <!-- Facts Utilized Badges -->
          <div class="surface-card p-3 border-round-xl border-1 surface-border">
            <span class="text-xs font-bold text-color-secondary uppercase block mb-2">Hechos Verificables Utilizados:</span>
            <div class="flex flex-wrap gap-2">
              <p-tag
                *ngFor="let fact of draftMessage.factsUtilized"
                [value]="'✓ ' + fact"
                severity="secondary"
              ></p-tag>
            </div>
          </div>

        </div>

      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-between align-items-center w-full">
          <div class="flex align-items-center gap-2 text-xs text-green-400">
            <i class="pi pi-check-circle"></i>
            <span>Validación de Guardrail 7.1 Activa</span>
          </div>
          <div class="flex gap-2">
            <p-button label="Cancelar" icon="pi pi-times" [outlined]="true" severity="secondary" (onClick)="close()"></p-button>
            <p-button
              label="Aprobar y Autorizar Envío (Sandbox)"
              icon="pi pi-send"
              severity="primary"
              [loading]="isSending"
              [disabled]="isLoading || isSending"
              (onClick)="onApproveAndSend()"
            ></p-button>
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class OutreachComposerModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() lead: Lead | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() sentSuccessEvent = new EventEmitter<void>();

  isLoading = false;
  isSending = false;
  draftMessage: OutreachMessage | null = null;
  editedSubject = '';
  editedBody = '';

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    if (this.isOpen && this.lead) {
      this.loadDraft();
    }
  }

  loadDraft(): void {
    if (!this.lead) return;
    this.isLoading = true;
    this.apiService.generateDraft({
      leadId: this.lead.id,
      hunterName: 'Santiago Romero',
      hunterRole: 'Director de Alianzas Estratégicas',
      channel: 'EMAIL'
    }).subscribe({
      next: (msg) => {
        this.draftMessage = msg;
        this.editedSubject = msg.subject;
        this.editedBody = msg.body;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error generating draft:', err);
        this.isLoading = false;
      }
    });
  }

  onApproveAndSend(): void {
    if (!this.draftMessage) return;
    this.isSending = true;
    this.apiService.approveAndSend({
      messageId: this.draftMessage.id,
      approvedBy: 'Santiago Romero (Hunter Inter.mx)',
      editedSubject: this.editedSubject,
      editedBody: this.editedBody
    }).subscribe({
      next: (res) => {
        this.isSending = false;
        alert(`¡Mensaje aprobado y despachado con éxito al Buzón Virtual de Salida Seguro (Sandbox)!\n\nID de Entrega: ${res.sandboxDelivery?.id}`);
        this.sentSuccessEvent.emit();
        this.close();
      },
      error: (err) => {
        this.isSending = false;
        alert(`Error al enviar mensaje: ${err.error?.message || err.message}`);
      }
    });
  }

  close(): void {
    this.closeEvent.emit();
  }
}
