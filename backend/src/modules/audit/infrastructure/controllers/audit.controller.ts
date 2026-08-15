import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAuditLogsUseCase } from '../../application/use-cases/get-audit-logs.use-case';
import { AuditLog } from '../../domain/entities/audit-log.entity';

@ApiTags('Audit & Guardrails Log (Sección 7.1)')
@Controller('audit')
export class AuditController {
  constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Consultar registro de auditoría inmutable de todas las acciones del sistema' })
  async getAll(): Promise<AuditLog[]> {
    return this.getAuditLogsUseCase.execute();
  }
}
