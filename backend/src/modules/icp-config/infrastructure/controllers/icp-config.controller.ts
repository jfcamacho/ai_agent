import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetIcpConfigUseCase } from '../../application/use-cases/get-icp-config.use-case';
import { UpdateIcpConfigUseCase } from '../../application/use-cases/update-icp-config.use-case';
import { IcpConfig } from '../../domain/entities/icp-config.entity';

@ApiTags('ICP Configuration & Blacklist (M01)')
@Controller('icp-config')
export class IcpConfigController {
  constructor(
    private readonly getIcpConfigUseCase: GetIcpConfigUseCase,
    private readonly updateIcpConfigUseCase: UpdateIcpConfigUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener configuración activa del ICP, pesos y lista de exclusiones (Blacklist)' })
  async getActive(): Promise<IcpConfig> {
    return this.getIcpConfigUseCase.execute();
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar configuración del ICP, sectores, umbrales y exclusiones' })
  async update(@Body() body: Partial<IcpConfig>): Promise<IcpConfig> {
    return this.updateIcpConfigUseCase.execute(body);
  }
}
