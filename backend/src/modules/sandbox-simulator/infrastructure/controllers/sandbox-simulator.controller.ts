import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TriggerDiscoveryUseCase } from '../../../leads/application/use-cases/trigger-discovery.use-case';
import { FirebaseService } from '../../../shared/database/firebase.service';
import { SimulateProspectReplyUseCase } from '../../application/use-cases/simulate-prospect-reply.use-case';

@ApiTags('Sandbox Simulator (Pruebas de Seguridad y Ciclo de Vida)')
@Controller('sandbox-simulator')
export class SandboxSimulatorController {
  constructor(
    private readonly simulateProspectReplyUseCase: SimulateProspectReplyUseCase,
    private readonly triggerDiscoveryUseCase: TriggerDiscoveryUseCase,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('simulate-reply')
  @ApiOperation({ summary: 'Simular respuesta de prospecto (Interés positivo, Opt-out o Duda) para validar guardrails' })
  async simulateReply(
    @Body()
    body: {
      leadId: string;
      scenario: 'POSITIVE_INTEREST' | 'OPT_OUT_UNSUBSCRIBE' | 'OBJECTION' | 'CUSTOM';
      customReplyText?: string;
    },
  ) {
    return this.simulateProspectReplyUseCase.execute(body);
  }

  @Post('seed-demo-leads')
  @ApiOperation({ summary: 'Sembrar prospectos iniciales de prueba para evaluación inmediata del Hunter' })
  async seedDemoLeads() {
    return this.triggerDiscoveryUseCase.execute(10);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Vaciar y reiniciar el estado completo del Sandbox para una nueva prueba' })
  async resetSandbox() {
    await this.firebaseService.resetStore();
    return {
      success: true,
      message: 'El entorno de pruebas Sandbox ha sido vaciado y reiniciado exitosamente a estado cero.',
      timestamp: new Date().toISOString(),
    };
  }
}
