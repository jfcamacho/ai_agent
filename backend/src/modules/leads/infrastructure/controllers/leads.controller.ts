import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApproveLeadUseCase } from '../../application/use-cases/approve-lead.use-case';
import { GetLeadsUseCase } from '../../application/use-cases/get-leads.use-case';
import { InvestigateCompanyUseCase } from '../../application/use-cases/investigate-company.use-case';
import { RejectLeadUseCase } from '../../application/use-cases/reject-lead.use-case';
import { TriggerDiscoveryUseCase } from '../../application/use-cases/trigger-discovery.use-case';
import { Lead } from '../../domain/entities/lead.entity';

@ApiTags('Leads (Bandeja del Hunter)')
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly getLeadsUseCase: GetLeadsUseCase,
    private readonly approveLeadUseCase: ApproveLeadUseCase,
    private readonly rejectLeadUseCase: RejectLeadUseCase,
    private readonly triggerDiscoveryUseCase: TriggerDiscoveryUseCase,
    private readonly investigateCompanyUseCase: InvestigateCompanyUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los leads y recomendaciones de IA para la bandeja del Hunter' })
  async getAll(): Promise<Lead[]> {
    return this.getLeadsUseCase.execute();
  }

  @Post('discover')
  @ApiOperation({ summary: 'Disparar búsqueda proactiva y scoring autónomo en el Agent Service' })
  async triggerDiscovery(
    @Query('max') max?: number,
    @Query('sector') sector?: string,
  ): Promise<{ discoveredCount: number; leads: Lead[] }> {
    return this.triggerDiscoveryUseCase.execute(max ? Number(max) : 15, sector);
  }

  @Post('investigate')
  @ApiOperation({ summary: 'Investigar y enriquecer cualquier empresa personalizada con IA bajo demanda' })
  async investigate(
    @Body() body: { name: string; domain: string; industry?: string; customContext?: string },
  ): Promise<Lead> {
    return this.investigateCompanyUseCase.execute(body);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprobar lead calificado por parte del Hunter (Human-in-the-Loop)' })
  async approve(
    @Param('id') id: string,
    @Body() body: { hunterName?: string; reason?: string },
  ): Promise<Lead> {
    return this.approveLeadUseCase.execute(id, body.hunterName, body.reason);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Rechazar o descartar lead con motivo' })
  async reject(
    @Param('id') id: string,
    @Body() body: { hunterName?: string; reason?: string },
  ): Promise<Lead> {
    return this.rejectLeadUseCase.execute(id, body.hunterName, body.reason);
  }
}
