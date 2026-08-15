import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDashboardMetricsUseCase } from '../../application/use-cases/get-dashboard-metrics.use-case';
import { DashboardMetrics } from '../../domain/entities/dashboard-metrics.entity';

@ApiTags('Executive Dashboard & Pilot Metrics (M12)')
@Controller('dashboard')
export class MetricsDashboardController {
  constructor(private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Obtener métricas ejecutivas del piloto de IA vs línea base tradicional (M12)' })
  async getMetrics(): Promise<DashboardMetrics> {
    return this.getDashboardMetricsUseCase.execute();
  }
}
