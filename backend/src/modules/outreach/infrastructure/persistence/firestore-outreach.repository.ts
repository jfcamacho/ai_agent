import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { OutreachMessage } from '../../domain/entities/outreach-message.entity';
import { IOutreachRepositoryPort } from '../../domain/ports/outreach-repository.port';

@Injectable()
export class FirestoreOutreachRepository implements IOutreachRepositoryPort {
  private readonly collectionName = 'outreach_messages';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<OutreachMessage[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    return snap.docs.map(d => new OutreachMessage({ id: d.id, ...d.data() }));
  }

  async findById(id: string): Promise<OutreachMessage | null> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.doc(id).get();
    if (!snap.exists) return null;
    return new OutreachMessage({ id: snap.id, ...snap.data() });
  }

  async findByLeadId(leadId: string): Promise<OutreachMessage[]> {
    const all = await this.findAll();
    return all.filter(m => m.leadId === leadId);
  }

  async save(message: OutreachMessage): Promise<OutreachMessage> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(message.id).set({ ...message }, { merge: true });
    return message;
  }

  async delete(id: string): Promise<void> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(id).delete();
  }
}
