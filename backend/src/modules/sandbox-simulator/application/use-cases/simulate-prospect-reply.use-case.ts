import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleAppointmentUseCase } from '../../../appointments/application/use-cases/schedule-appointment.use-case';
import { ILeadRepositoryPort, LEAD_REPOSITORY_TOKEN } from '../../../leads/domain/ports/lead-repository.port';
import { ProcessResponseUseCase } from '../../../triage/application/use-cases/process-response.use-case';

@Injectable()
export class SimulateProspectReplyUseCase {
  constructor(
    @Inject(LEAD_REPOSITORY_TOKEN)
    private readonly leadRepo: ILeadRepositoryPort,
    private readonly processResponseUseCase: ProcessResponseUseCase,
    private readonly scheduleAppointmentUseCase: ScheduleAppointmentUseCase,
  ) {}

  async execute(payload: {
    leadId: string;
    scenario: 'POSITIVE_INTEREST' | 'OPT_OUT_UNSUBSCRIBE' | 'OBJECTION' | 'CUSTOM';
    customReplyText?: string;
  }): Promise<{ triageResult: any; autoScheduledAppointment?: any }> {
    const lead = await this.leadRepo.findById(payload.leadId);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${payload.leadId} not found`);
    }

    let replyText = '';
    if (payload.scenario === 'POSITIVE_INTEREST') {
      replyText = `¡Hola! Con mucho gusto. Nos hace mucho sentido integrar microseguros en nuestra plataforma. ¿Tienen disponibilidad el próximo martes a las 10:00 AM para una sesión de 30 minutos?`;
    } else if (payload.scenario === 'OPT_OUT_UNSUBSCRIBE') {
      replyText = `No estamos interesados en este momento. Por favor cancelar suscripción y eliminar nuestros datos de su lista de contacto.`;
    } else if (payload.scenario === 'OBJECTION') {
      replyText = `¿Qué aseguradoras respaldan las pólizas de Inter.mx y cuál es el esquema de comisiones y costos de integración API?`;
    } else {
      replyText = payload.customReplyText || 'Gracias por el mensaje.';
    }

    const triageRecord = await this.processResponseUseCase.execute({
      leadId: lead.id,
      prospectReply: replyText,
      contactName: lead.primaryContact?.name || 'Decisor Aliado'
    });

    let autoScheduledAppointment: any = null;

    if (triageRecord.sentiment === 'POSITIVE_INTEREST') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const dateStr = tomorrow.toISOString().split('T')[0];

      autoScheduledAppointment = await this.scheduleAppointmentUseCase.execute({
        leadId: lead.id,
        meetingDate: dateStr,
        meetingTime: '10:00 AM (CDMX)',
        durationMinutes: 30,
        agendaSummary: `Reunión de exploración de alianza B2B2C con ${lead.companyName} solicitada en respuesta al contacto de prospección.`
      });
    }

    return {
      triageResult: triageRecord,
      autoScheduledAppointment
    };
  }
}
