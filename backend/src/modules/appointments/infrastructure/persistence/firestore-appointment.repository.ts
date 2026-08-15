import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { Appointment } from '../../domain/entities/appointment.entity';
import { IAppointmentRepositoryPort } from '../../domain/ports/appointment-repository.port';

@Injectable()
export class FirestoreAppointmentRepository implements IAppointmentRepositoryPort {
  private readonly collectionName = 'appointments';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<Appointment[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    return snap.docs.map(d => new Appointment({ id: d.id, ...d.data() }));
  }

  async findById(id: string): Promise<Appointment | null> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.doc(id).get();
    if (!snap.exists) return null;
    return new Appointment({ id: snap.id, ...snap.data() });
  }

  async findByLeadId(leadId: string): Promise<Appointment[]> {
    const all = await this.findAll();
    return all.filter(a => a.leadId === leadId);
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(appointment.id).set({ ...appointment }, { merge: true });
    return appointment;
  }

  async delete(id: string): Promise<void> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(id).delete();
  }
}
