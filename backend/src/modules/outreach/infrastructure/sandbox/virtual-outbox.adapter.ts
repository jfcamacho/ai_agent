import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { OutreachMessage } from '../../domain/entities/outreach-message.entity';
import { IVirtualOutboxPort, VirtualOutboxRecord } from '../../domain/ports/virtual-outbox.port';

@Injectable()
export class VirtualOutboxAdapter implements IVirtualOutboxPort {
  private readonly logger = new Logger(VirtualOutboxAdapter.name);
  private readonly collectionName = 'virtual_outbox';

  constructor(private readonly firebaseService: FirebaseService) {}

  async dispatchMessage(message: OutreachMessage): Promise<VirtualOutboxRecord> {
    const recordId = `vmail_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Render clean HTML body with Inter.mx branding
    const renderedHtmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 2px solid #0045ff; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="color: #0045ff; margin: 0;">Inter.mx · Alianzas Estratégicas</h2>
          <small style="color: #64748b;">Buzón Virtual de Salida Seguro (Sandbox / Dry-Run)</small>
        </div>
        <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1e293b;">
${message.body}
        </div>
        <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          <p>Enviado de forma segura en modo Sandbox de pruebas. Destinatario simulado: ${message.recipientEmail}</p>
        </div>
      </div>
    `;

    const record: VirtualOutboxRecord = {
      id: recordId,
      messageId: message.id,
      recipientEmail: message.recipientEmail,
      recipientName: message.recipientName,
      companyName: message.companyName,
      subject: message.subject,
      renderedHtmlBody,
      deliveredAt: new Date().toISOString(),
      status: 'DELIVERED_VIRTUAL_SANDBOX'
    };

    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(recordId).set(record);

    this.logger.log(`[VIRTUAL OUTBOX SANDBOX] Mensaje simulado entregado a ${message.recipientEmail} (ID: ${recordId})`);
    return record;
  }

  async getAllSentRecords(): Promise<VirtualOutboxRecord[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    const records = snap.docs.map(d => d.data() as VirtualOutboxRecord);
    return records.sort((a, b) => new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime());
  }

  async getRecordByMessageId(messageId: string): Promise<VirtualOutboxRecord | null> {
    const all = await this.getAllSentRecords();
    return all.find(r => r.messageId === messageId) || null;
  }
}
