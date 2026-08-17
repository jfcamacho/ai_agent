import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firestore: admin.firestore.Firestore | null = null;
  private inMemoryStore: Map<string, Map<string, any>> = new Map();

  onModuleInit() {
    try {
      if (admin.apps.length === 0) {
        const projectId = process.env.GCP_PROJECT_ID || 'gen-lang-client-0311520356';
        
        // Auto-connect to real Firestore on Cloud Run or when credentials are provided
        if (process.env.K_SERVICE || process.env.NODE_ENV === 'production' || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          admin.initializeApp({
            projectId
          });
          this.firestore = admin.firestore();
          this.logger.log(`[FIRESTORE LIVE] ✅ Conectado exitosamente a Google Cloud Firestore nativo (Proyecto: ${projectId}).`);
        } else {
          this.logger.warn(
            '[FIRESTORE LOCAL] Ejecutando con almacén seguro en memoria para desarrollo local. ' +
            'En Cloud Run se conecta automáticamente a Google Cloud Firestore.'
          );
        }
      } else {
        this.firestore = admin.firestore();
        this.logger.log('[FIRESTORE LIVE] ✅ Usando instancia activa de Firestore.');
      }
    } catch (error) {
      this.logger.warn('[FIRESTORE FALLBACK] Activado almacén en memoria por advertencia:', error);
    }
  }

  public async resetStore(): Promise<void> {
    if (this.firestore) {
      const collections = ['leads', 'companies', 'virtual_outbox', 'appointments', 'audit_logs', 'outreach_messages', 'icp_config'];
      for (const coll of collections) {
        try {
          const snap = await this.firestore.collection(coll).get();
          for (const doc of snap.docs) {
            await doc.ref.delete();
          }
        } catch (e) {
          this.logger.warn(`Error limpiando coleccion Firestore ${coll}:`, e);
        }
      }
    }
    this.inMemoryStore.clear();
    this.logger.log('[FIRESTORE RESET] Base de datos restablecida correctamente.');
  }

  public getCollection(collectionName: string) {
    if (this.firestore) {
      return {
        doc: (id: string) => ({
          get: async () => {
            const snap = await this.firestore!.collection(collectionName).doc(id).get();
            return {
              exists: snap.exists,
              data: () => snap.data(),
              id: snap.id
            };
          },
          set: async (data: any, options?: any) => {
            // Strip undefined values which Firestore rejects
            const sanitized = JSON.parse(JSON.stringify(data));
            await this.firestore!.collection(collectionName).doc(id).set(sanitized, options);
          },
          update: async (data: any) => {
            const sanitized = JSON.parse(JSON.stringify(data));
            await this.firestore!.collection(collectionName).doc(id).update(sanitized);
          },
          delete: async () => {
            await this.firestore!.collection(collectionName).doc(id).delete();
          }
        }),
        get: async () => {
          const snap = await this.firestore!.collection(collectionName).get();
          return {
            docs: snap.docs.map(d => ({
              id: d.id,
              data: () => d.data()
            }))
          };
        }
      };
    }

    // In-memory fallback for local dev
    if (!this.inMemoryStore.has(collectionName)) {
      this.inMemoryStore.set(collectionName, new Map());
    }
    const collectionMap = this.inMemoryStore.get(collectionName)!;

    return {
      doc: (id: string) => ({
        get: async () => {
          const exists = collectionMap.has(id);
          const data = collectionMap.get(id);
          return {
            exists,
            data: () => data,
            id
          };
        },
        set: async (data: any, options?: any) => {
          if (options && options.merge && collectionMap.has(id)) {
            const existing = collectionMap.get(id);
            collectionMap.set(id, { ...existing, ...data });
          } else {
            collectionMap.set(id, data);
          }
        },
        update: async (data: any) => {
          const existing = collectionMap.get(id) || {};
          collectionMap.set(id, { ...existing, ...data });
        },
        delete: async () => {
          collectionMap.delete(id);
        }
      }),
      get: async () => {
        const docs = Array.from(collectionMap.entries()).map(([id, data]) => ({
          id,
          data: () => data
        }));
        return { docs };
      }
    };
  }
}
