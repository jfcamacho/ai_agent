export class AuditLog {
  id: string;
  eventType: string;
  entityId: string;
  performedBy: string;
  details: Record<string, any>;
  timestamp: string;

  constructor(partial: Partial<AuditLog>) {
    Object.assign(this, partial);
  }
}
