import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { Lead } from '../../domain/entities/lead.entity';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { ILeadRepositoryPort } from '../../domain/ports/lead-repository.port';

@Injectable()
export class FirestoreLeadRepository implements ILeadRepositoryPort {
  private readonly collectionName = 'leads';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<Lead[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    return snap.docs.map(d => new Lead({ id: d.id, ...d.data() }));
  }

  async findById(id: string): Promise<Lead | null> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.doc(id).get();
    if (!snap.exists) return null;
    return new Lead({ id: snap.id, ...snap.data() });
  }

  async findByStatus(status: LeadStatus): Promise<Lead[]> {
    const leads = await this.findAll();
    return leads.filter(l => l.status === status);
  }

  async findByCompanyId(companyId: string): Promise<Lead | null> {
    const leads = await this.findAll();
    return leads.find(l => l.companyId === companyId) || null;
  }

  async save(lead: Lead): Promise<Lead> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(lead.id).set({ ...lead }, { merge: true });
    return lead;
  }

  async saveBatch(leads: Lead[]): Promise<Lead[]> {
    for (const l of leads) {
      await this.save(l);
    }
    return leads;
  }

  async delete(id: string): Promise<void> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(id).delete();
  }
}
