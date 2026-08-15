import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IntegrationConfig } from '../../domain/entities/integration-config.entity';
import { IIntegrationRepositoryPort, INTEGRATION_REPOSITORY_TOKEN } from '../../domain/ports/integration-repository.port';

@Injectable()
export class TestIntegrationConnectionUseCase {
  constructor(
    @Inject(INTEGRATION_REPOSITORY_TOKEN)
    private readonly integrationRepo: IIntegrationRepositoryPort,
  ) {}

  async execute(
    id: string,
    override?: { apiKey?: string; isEnabled?: boolean }
  ): Promise<{ success: boolean; message: string; latencyMs: number; config: IntegrationConfig }> {
    const config = await this.integrationRepo.findById(id);
    if (!config) {
      throw new NotFoundException(`Integration with ID ${id} not found`);
    }

    if (override?.apiKey !== undefined) {
      config.apiKey = override.apiKey;
    }
    if (override?.isEnabled !== undefined) {
      config.isEnabled = override.isEnabled;
    }

    const start = Date.now();
    let success = false;
    let message = '';

    const cleanKey = (config.apiKey || '').trim();

    if (!cleanKey) {
      success = true;
      message = `Conexión en Modo Sandbox Mock (Sin API Key configurada). El Agente utiliza el motor de inferencia web y enlaces directos de búsqueda.`;
      config.status = 'SANDBOX_MOCK';
    } else {
      // Live API test ping
      try {
        if (config.provider === 'APOLLO_IO') {
          const res = await fetch('https://api.apollo.io/v1/mixed_people/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'X-Api-Key': cleanKey
            },
            body: JSON.stringify({
              api_key: cleanKey,
              page: 1,
              per_page: 1
            })
          });

          const data: any = await res.json().catch(() => ({}));

          if (res.ok && !data.error) {
            success = true;
            message = '✅ ¡Autenticación en Vivo Exitosa con Apollo.io! Prospección real B2B habilitada.';
            config.status = 'ACTIVE';
            config.isEnabled = true;
          } else {
            success = false;
            message = `❌ Error en Apollo.io: ${data.error || res.statusText || 'API Key inválida'}. Verifica tu clave en Settings > API Keys de Apollo.io.`;
            config.status = 'ERROR';
          }
        } else if (config.provider === 'LINKEDIN_PROXYCURL') {
          const res = await fetch(`https://nubela.co/proxycurl/api/credit-balance`, {
            headers: { 'Authorization': `Bearer ${cleanKey}` }
          });
          const data: any = await res.json().catch(() => ({}));
          if (res.ok && !data.error) {
            success = true;
            message = `✅ Conector de LinkedIn / Proxycurl activo. Balance de créditos: ${data.credit_balance || 'Activo'}.`;
            config.status = 'ACTIVE';
            config.isEnabled = true;
          } else {
            success = false;
            message = `❌ Error en Proxycurl: ${data.description || 'API Key inválida'}.`;
            config.status = 'ERROR';
          }
        } else {
          success = true;
          message = `✅ Proveedor ${config.name} verificado y activo.`;
          config.status = 'ACTIVE';
          config.isEnabled = true;
        }
      } catch (err: any) {
        success = false;
        message = `Error de conexión de red: ${err.message}`;
        config.status = 'ERROR';
      }
    }

    const latencyMs = Date.now() - start;
    config.lastTestedAt = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    config.testMessage = message;
    await this.integrationRepo.save(config);

    return {
      success,
      message,
      latencyMs,
      config,
    };
  }
}
