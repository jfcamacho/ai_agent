import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcessResponseUseCase } from '../../application/use-cases/process-response.use-case';
import { TriageRecord } from '../../domain/entities/triage-result.entity';

@ApiTags('Triage (Clasificación de Respuestas & Guardrails M10)')
@Controller('triage')
export class TriageController {
  constructor(private readonly processResponseUseCase: ProcessResponseUseCase) {}

  @Post('process')
  @ApiOperation({ summary: 'Procesar y clasificar respuesta entrante de un prospecto' })
  async process(
    @Body()
    body: {
      leadId: string;
      prospectReply: string;
      contactName?: string;
    },
  ): Promise<TriageRecord> {
    return this.processResponseUseCase.execute(body);
  }

  @Get('history')
  @ApiOperation({ summary: 'Consultar historial de respuestas clasificadas' })
  async getHistory(): Promise<TriageRecord[]> {
    return this.processResponseUseCase.getAll();
  }
}
