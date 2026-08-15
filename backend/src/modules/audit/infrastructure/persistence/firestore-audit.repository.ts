import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { IAuditRepositoryPort } from '../../domain/ports/audit-repository.port';

@Injectable()
export class FirestoreAuditRepository implements IAuditRepositoryPort {
  private readonly collectionName = 'audit_logs';

  constructor(private readonly firebaseService: FirebaseService) {}

  async record(log: Partial<AuditLog>): Promise<AuditLog> {
    const id = log.id || `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const fullLog = new AuditLog({
      id,
      eventType: log.eventType || 'SYSTEM_EVENT',
      entityId: log.entityId || 'N/A',
      performedBy: log.performedBy || 'SYSTEM',
      details: log.details || {},
      timestamp: new Date().toISOString()
    });

    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(id).set({ ...fullLog });
    return fullLog;
  }

  async findAll(): Promise<AuditLog[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    const logs = snap.docs.map(d => new AuditLog({ id: d.id, ...d.data() }));
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async findByEntityId(entityId: string): Promise<AuditLog[]> {
    const logs = await this.findAll();
    return logs.filter(l => l.entityId === entityId);
  }
}
