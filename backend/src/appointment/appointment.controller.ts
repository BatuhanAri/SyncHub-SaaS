import { Controller, Post, Get, Patch, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
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

  @Get()
  @ApiOperation({ summary: 'Get all appointments for the tenant' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  async findAll(@GetTenantId() tenantId: string) {
    return this.appointmentService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment detail' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@GetTenantId() tenantId: string, @Param('id') id: string) {
    return this.appointmentService.findOne(tenantId, id);
  }

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

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status (cancel, confirm, complete)' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @GetTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.appointmentService.updateStatus(tenantId, id, status);
  }
}
