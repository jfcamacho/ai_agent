import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAppointmentsUseCase } from '../../application/use-cases/get-appointments.use-case';
import { ScheduleAppointmentUseCase } from '../../application/use-cases/schedule-appointment.use-case';
import { Appointment } from '../../domain/entities/appointment.entity';

@ApiTags('Appointments (Citas Calificadas & Calendario M11)')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly getAppointmentsUseCase: GetAppointmentsUseCase,
    private readonly scheduleAppointmentUseCase: ScheduleAppointmentUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las citas calificadas agendadas por el sistema' })
  async getAll(): Promise<Appointment[]> {
    return this.getAppointmentsUseCase.execute();
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Confirmar y agendar cita calificada con decisor de la empresa' })
  async schedule(
    @Body()
    body: {
      leadId: string;
      meetingDate: string;
      meetingTime: string;
      durationMinutes?: number;
      hunterName?: string;
      agendaSummary?: string;
    },
  ): Promise<Appointment> {
    return this.scheduleAppointmentUseCase.execute(body);
  }
}
