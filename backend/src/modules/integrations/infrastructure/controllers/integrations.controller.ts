import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetIntegrationsUseCase } from '../../application/use-cases/get-integrations.use-case';
import { SaveIntegrationUseCase } from '../../application/use-cases/save-integration.use-case';
import { SearchPeopleUseCase } from '../../application/use-cases/search-people.use-case';
import { TestIntegrationConnectionUseCase } from '../../application/use-cases/test-integration-connection.use-case';
import { IntegrationConfig } from '../../domain/entities/integration-config.entity';

@ApiTags('Integraciones & APIs de Prospección (M06)')
@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly getIntegrationsUseCase: GetIntegrationsUseCase,
    private readonly saveIntegrationUseCase: SaveIntegrationUseCase,
    private readonly testConnectionUseCase: TestIntegrationConnectionUseCase,
    private readonly searchPeopleUseCase: SearchPeopleUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las integraciones y proveedores B2B configurados' })
  async getAll(): Promise<IntegrationConfig[]> {
    return this.getIntegrationsUseCase.execute();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Guardar o actualizar la API Key y configuración de un proveedor' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<IntegrationConfig>,
  ): Promise<IntegrationConfig> {
    return this.saveIntegrationUseCase.execute(id, body);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Probar la conexión en vivo o en modo Sandbox con la API seleccionada' })
  async testConnection(
    @Param('id') id: string,
    @Body() body?: { apiKey?: string; isEnabled?: boolean },
  ): Promise<{ success: boolean; message: string; latencyMs: number; config: IntegrationConfig }> {
    return this.testConnectionUseCase.execute(id, body);
  }

  @Post('search-people')
  @ApiOperation({ summary: 'Buscar colaboradores y decisores por empresa, persona y departamento (Apollo, LinkedIn, etc.)' })
  async searchPeople(
    @Body() body: { companyName: string; domain?: string; personName?: string; roleOrDepartment?: string },
  ) {
    return this.searchPeopleUseCase.execute(body);
  }
}
