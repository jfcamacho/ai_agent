export enum OutreachStatus {
  DRAFT = 'DRAFT',
  APPROVED_PENDING_SEND = 'APPROVED_PENDING_SEND',
  SENT_SANDBOX = 'SENT_SANDBOX',
  SENT_LIVE = 'SENT_LIVE',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export class OutreachMessage {
  id: string;
  leadId: string;
  companyId: string;
  companyName: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  channel: 'EMAIL' | 'LINKEDIN';
  subject: string;
  body: string;
  valueProposition: string;
  hookRationale: string;
  factsUtilized: string[];
  guardrailsVerified: boolean;
  status: OutreachStatus;
  hunterApproval?: {
    approvedBy: string;
    approvedAt: string;
    editsMade: boolean;
  };
  sentAt?: string;
  deliveryLog?: {
    virtualId: string;
    simulatedStatus: string;
    timestamp: string;
    recipientHost: string;
  };
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<OutreachMessage>) {
    Object.assign(this, partial);
  }
}
