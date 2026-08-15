import { Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { ICompanyRepositoryPort } from '../../domain/ports/company-repository.port';
import { FirebaseService } from '../../../shared/database/firebase.service';

@Injectable()
export class FirestoreCompanyRepository implements ICompanyRepositoryPort {
  private readonly collectionName = 'companies';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(): Promise<Company[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();
    return snap.docs.map(d => new Company({ id: d.id, ...d.data() }));
  }

  async findById(id: string): Promise<Company | null> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.doc(id).get();
    if (!snap.exists) return null;
    return new Company({ id: snap.id, ...snap.data() });
  }

  async findByDomain(domain: string): Promise<Company | null> {
    const companies = await this.findAll();
    return companies.find(c => c.domain.toLowerCase() === domain.toLowerCase()) || null;
  }

  async save(company: Company): Promise<Company> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(company.id).set({ ...company }, { merge: true });
    return company;
  }

  async saveBatch(companies: Company[]): Promise<Company[]> {
    for (const c of companies) {
      await this.save(c);
    }
    return companies;
  }

  async delete(id: string): Promise<void> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(id).delete();
  }
}
