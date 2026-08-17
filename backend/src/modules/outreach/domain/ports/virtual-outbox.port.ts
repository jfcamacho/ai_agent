import { OutreachMessage } from '../entities/outreach-message.entity';

export const VIRTUAL_OUTBOX_PORT_TOKEN = 'VIRTUAL_OUTBOX_PORT';

export interface VirtualOutboxRecord {
  id: string;
  messageId: string;
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  subject: string;
  renderedHtmlBody: string;
  deliveredAt: string;
  status: 'DELIVERED_VIRTUAL_SANDBOX' | 'DELIVERED_LIVE_EMAIL' | 'OPENED_SIMULATED';
}

export interface IVirtualOutboxPort {
  dispatchMessage(message: OutreachMessage): Promise<VirtualOutboxRecord>;
  getAllSentRecords(): Promise<VirtualOutboxRecord[]>;
  getRecordByMessageId(messageId: string): Promise<VirtualOutboxRecord | null>;
}
