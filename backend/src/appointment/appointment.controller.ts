import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { GetTenantId } from '../common/decorators/tenant.decorator';
import { ApiTags, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant ID required for all requests to ensure data isolation',
  required: true,
})
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Creates a new appointment with conflict checking and distributed lock' })
  @ApiResponse({ status: 201, description: 'Appointment successfully created' })
  @ApiResponse({ status: 409, description: 'Timeslot conflict or locking error' })
  async create(
    @GetTenantId() tenantId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.createAppointment(tenantId, createAppointmentDto);
  }
}
