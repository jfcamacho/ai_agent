import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { IcpConfig } from '../../domain/entities/icp-config.entity';
import { IIcpConfigRepositoryPort } from '../../domain/ports/icp-config-repository.port';

@Injectable()
export class FirestoreIcpConfigRepository implements IIcpConfigRepositoryPort {
  private readonly collectionName = 'icp_configurations';
  private readonly defaultDocId = 'active_icp_config';

  constructor(private readonly firebaseService: FirebaseService) {}

  async getActiveConfig(): Promise<IcpConfig> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.doc(this.defaultDocId).get();

    if (snap.exists && snap.data()) {
      return new IcpConfig({ id: snap.id, ...snap.data() });
    }

    // Default Inter.mx ICP from document
    const defaultConfig = new IcpConfig({
      id: this.defaultDocId,
      version: 1,
      targetIndustries: [
        'Fintech',
        'HR Tech',
        'Retail & E-commerce',
        'Logistics Tech',
        'Mobility & Automotive'
      ],
      targetCompanySizes: ['100-500', '500-1000', '1000+'],
      targetLocations: ['México', 'LATAM'],
      targetDecisionMakerRoles: [
        'Director de Alianzas',
        'VP of Strategic Partnerships',
        'Chief Product Officer (CPO)',
        'Head of Business Development',
        'Director de Beneficios'
      ],
      excludedKeywords: ['Aseguradora directa', 'Competidor directo broker'],
      blacklistedDomains: ['gnp.com.mx', 'qualitas.com.mx', 'metlife.com.mx', 'axa.mx'],
      minimumScoreThreshold: 75,
      autoApproveThreshold: 90,
      weights: {
        icpFit: 0.30,
        b2b2cPotential: 0.30,
        channelReadiness: 0.20,
        marketPresence: 0.20
      },
      isActive: true,
      updatedAt: new Date().toISOString()
    });

    await this.save(defaultConfig);
    return defaultConfig;
  }

  async save(config: IcpConfig): Promise<IcpConfig> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const sanitized = JSON.parse(JSON.stringify(config));
    await col.doc(this.defaultDocId).set(sanitized);
    return config;
  }
}
