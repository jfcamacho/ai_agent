import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApproveAndSendOutreachUseCase } from '../../application/use-cases/approve-and-send-outreach.use-case';
import { GenerateOutreachDraftUseCase } from '../../application/use-cases/generate-outreach-draft.use-case';
import { GetVirtualOutboxUseCase } from '../../application/use-cases/get-virtual-outbox.use-case';
import { OutreachMessage } from '../../domain/entities/outreach-message.entity';
import { VirtualOutboxRecord } from '../../domain/ports/virtual-outbox.port';

@ApiTags('Outreach (Taller de Redacción & Aprobación)')
@Controller('outreach')
export class OutreachController {
  constructor(
    private readonly generateDraftUseCase: GenerateOutreachDraftUseCase,
    private readonly approveAndSendUseCase: ApproveAndSendOutreachUseCase,
    private readonly getVirtualOutboxUseCase: GetVirtualOutboxUseCase,
  ) {}

  @Post('draft')
  @ApiOperation({ summary: 'Generar borrador de correo personalizado con IA y guardrails anti-alucinación' })
  async generateDraft(
    @Body()
    body: {
      leadId: string;
      hunterName?: string;
      hunterRole?: string;
      channel?: 'EMAIL' | 'LINKEDIN';
    },
  ): Promise<OutreachMessage> {
    return this.generateDraftUseCase.execute(body);
  }

  @Post('approve-and-send')
  @ApiOperation({ summary: 'Autorizar y despachar mensaje en modo Sandbox seguro (Human-in-the-Loop M09)' })
  async approveAndSend(
    @Body()
    body: {
      messageId: string;
      approvedBy: string;
      editedSubject?: string;
      editedBody?: string;
    },
  ): Promise<{ message: OutreachMessage; sandboxDelivery: any }> {
    return this.approveAndSendUseCase.execute(body);
  }

  @Get('virtual-outbox')
  @ApiOperation({ summary: 'Consultar todos los mensajes despachados al buzón virtual de salida (Sandbox)' })
  async getVirtualOutbox(): Promise<VirtualOutboxRecord[]> {
    return this.getVirtualOutboxUseCase.execute();
  }
}
