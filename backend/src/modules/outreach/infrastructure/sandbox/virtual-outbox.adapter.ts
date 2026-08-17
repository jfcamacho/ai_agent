import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { OutreachMessage } from '../../domain/entities/outreach-message.entity';
import { IVirtualOutboxPort, VirtualOutboxRecord } from '../../domain/ports/virtual-outbox.port';

@Injectable()
export class VirtualOutboxAdapter implements IVirtualOutboxPort {
  private readonly logger = new Logger(VirtualOutboxAdapter.name);
  private readonly collectionName = 'virtual_outbox';
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly firebaseService: FirebaseService) {
    this.initMailTransporter();
  }

  private initMailTransporter() {
    const isLive = process.env.EMAIL_DELIVERY_MODE === 'LIVE';
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (isLive && smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      this.logger.log(`[OUTBOX] 🚀 Configurado despachador de correos REALES vía SMTP: ${smtpHost} (${smtpUser})`);
    } else if (isLive && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      this.logger.log(`[OUTBOX] 🚀 Configurado despachador de correos REALES vía Gmail: ${process.env.GMAIL_USER}`);
    } else {
      this.logger.log(`[OUTBOX] 🛡️ Modo Sandbox / Virtual Outbox activo (cero riesgo, correos simulados en buzón virtual)`);
    }
  }

  async dispatchMessage(message: OutreachMessage): Promise<VirtualOutboxRecord> {
    const recordId = `vmail_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const isLive = this.transporter !== null;
    
    // Render clean HTML body with Inter.mx branding
    const renderedHtmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #0045ff; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0045ff; margin: 0; font-size: 20px; font-weight: bold;">Inter.mx · Alianzas Estratégicas B2B2C</h2>
          <small style="color: #64748b; font-size: 12px;">${isLive ? 'Mensaje Transaccional Verificado' : 'Buzón Virtual Seguro (Sandbox / Dry-Run)'}</small>
        </div>
        <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #1e293b;">
${message.body}
        </div>
        <div style="margin-top: 28px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">Enviado por el equipo de Alianzas Estratégicas de Inter.mx. Si no deseas recibir más comunicaciones sobre alianzas, responde con la palabra "Baja".</p>
        </div>
      </div>
    `;

    let status: 'DELIVERED_VIRTUAL_SANDBOX' | 'DELIVERED_LIVE_EMAIL' = 'DELIVERED_VIRTUAL_SANDBOX';

    // If live transporter is active, send real email!
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: process.env.SMTP_FROM || `"Alianzas Inter.mx" <${process.env.GMAIL_USER || process.env.SMTP_USER || 'alianzas@inter.mx'}>`,
          to: message.recipientEmail,
          subject: message.subject,
          html: renderedHtmlBody,
          text: message.body
        });
        status = 'DELIVERED_LIVE_EMAIL';
        this.logger.log(`[OUTBOX LIVE] Correo REAL enviado exitosamente a: ${message.recipientEmail} (${message.subject})`);
      } catch (err: any) {
        this.logger.error(`[OUTBOX LIVE ERROR] Error enviando correo real a ${message.recipientEmail}: ${err.message}. Guardando en Buzón Virtual.`);
      }
    }

    const record: VirtualOutboxRecord = {
      id: recordId,
      messageId: message.id,
      recipientEmail: message.recipientEmail,
      recipientName: message.recipientName,
      companyName: message.companyName,
      subject: message.subject,
      renderedHtmlBody,
      deliveredAt: new Date().toISOString(),
      status
    };

    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(recordId).set(record);

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
