import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { IntegrationConfig } from '../../domain/entities/integration-config.entity';
import { IIntegrationRepositoryPort } from '../../domain/ports/integration-repository.port';

@Injectable()
export class FirestoreIntegrationRepository implements IIntegrationRepositoryPort {
  private readonly collectionName = 'integration_configs';

  constructor(private readonly firebaseService: FirebaseService) {}

  private getDefaultIntegrations(): IntegrationConfig[] {
    return [
      new IntegrationConfig({
        id: 'int_apollo_io',
        provider: 'APOLLO_IO',
        name: 'Apollo.io B2B Enrichment',
        description: 'Búsqueda de tomadores de decisiones, directores y correos corporativos verificados con teléfonos directos.',
        category: 'PEOPLE_ENRICHMENT',
        apiKey: '',
        endpointUrl: 'https://api.apollo.io/v1',
        isEnabled: true,
        status: 'SANDBOX_MOCK',
        rateLimitRemaining: 1500,
        featuresSupported: ['Búsqueda por Cargo y Seniority', 'Correos Corporativos Verificados', 'Teléfonos Directos de Oficina']
      }),
      new IntegrationConfig({
        id: 'int_linkedin_proxycurl',
        provider: 'LINKEDIN_PROXYCURL',
        name: 'LinkedIn Enterprise / Proxycurl',
        description: 'Extracción en tiempo real del organigrama corporativo y perfiles ejecutivos de LinkedIn en México.',
        category: 'PEOPLE_ENRICHMENT',
        apiKey: '',
        endpointUrl: 'https://nubela.co/proxycurl/api/v2',
        isEnabled: true,
        status: 'SANDBOX_MOCK',
        rateLimitRemaining: 500,
        featuresSupported: ['Organigrama de Empleados', 'Filtro por Departamento y País', 'Historial Laboral']
      }),
      new IntegrationConfig({
        id: 'int_hunter_io',
        provider: 'HUNTER_IO',
        name: 'Hunter.io Domain & Email Verifier',
        description: 'Detección de patrones de correo corporativo (@inter.mx) y validación de entregabilidad SMTP.',
        category: 'EMAIL_VERIFICATION',
        apiKey: '',
        endpointUrl: 'https://api.hunter.io/v2',
        isEnabled: false,
        status: 'INACTIVE',
        rateLimitRemaining: 100,
        featuresSupported: ['Búsqueda por Dominio', 'Verificación de Entregabilidad SMTP', 'Detección de Patrones']
      }),
      new IntegrationConfig({
        id: 'int_dropcontact',
        provider: 'DROPCONTACT',
        name: 'Dropcontact Clean CRM',
        description: 'Normalización de datos de contacto y enriquecimiento automático 100% compliant con normativas de privacidad.',
        category: 'PEOPLE_ENRICHMENT',
        apiKey: '',
        endpointUrl: 'https://api.dropcontact.com',
        isEnabled: false,
        status: 'INACTIVE',
        rateLimitRemaining: 250,
        featuresSupported: ['Enriquecimiento GDPR / LFPDPPP Compliant', 'Limpieza de Nombres y Títulos']
      })
    ];
  }

  async findAll(): Promise<IntegrationConfig[]> {
    const col = this.firebaseService.getCollection(this.collectionName);
    const snap = await col.get();

    if (!snap.docs || snap.docs.length === 0) {
      const defaults = this.getDefaultIntegrations();
      for (const d of defaults) {
        await col.doc(d.id).set({ ...d });
      }
      return defaults;
    }

    return snap.docs.map(doc => new IntegrationConfig({ id: doc.id, ...doc.data() }));
  }

  async findById(id: string): Promise<IntegrationConfig | null> {
    const all = await this.findAll();
    return all.find(i => i.id === id) || null;
  }

  async findByProvider(provider: string): Promise<IntegrationConfig | null> {
    const all = await this.findAll();
    return all.find(i => i.provider === provider) || null;
  }

  async save(config: IntegrationConfig): Promise<IntegrationConfig> {
    const col = this.firebaseService.getCollection(this.collectionName);
    await col.doc(config.id).set({ ...config });
    return config;
  }
}
