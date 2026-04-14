import { Injectable, BadRequestException, ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Service } from '../service/entities/service.entity';
import { RedisService } from '../common/redis/redis.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    private readonly redisService: RedisService,
    private readonly webhooksService: WebhooksService,
  ) {}

  async findAll(tenantId: string): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { tenantId },
      relations: ['service'],
      order: { startTime: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id, tenantId },
      relations: ['service'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async updateStatus(tenantId: string, id: string, status: string): Promise<Appointment> {
    const appointment = await this.findOne(tenantId, id);
    appointment.status = status;
    return this.appointmentRepo.save(appointment);
  }

  async createAppointment(tenantId: string, dto: CreateAppointmentDto) {
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId, tenantId },
    });

    if (!service) {
      throw new BadRequestException('Service not found or does not belong to this tenant');
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

    // Business Hours Validation (e.g. 09:00 to 18:00 UTC)
    const startHour = startTime.getUTCHours();
    const endHour = endTime.getUTCHours();
    if (startHour < 9 || endHour >= 18 || (endHour === 18 && endTime.getUTCMinutes() > 0)) {
      throw new BadRequestException('Appointments can only be scheduled between 09:00 and 18:00 UTC');
    }

    const lockKey = `lock:appointment:${tenantId}:${service.id}`;
    const lockId = await this.redisService.acquireLock(lockKey, 3000);

    if (!lockId) {
      throw new ConflictException('Service is currently being booked by someone else. Please try again in a moment.');
    }

    try {
      const overlap = await this.appointmentRepo.findOne({
        where: {
          serviceId: service.id,
          tenantId,
          startTime: LessThan(endTime),
          endTime: MoreThan(startTime),
        },
      });

      if (overlap) {
        throw new ConflictException('This timeslot is already booked.');
      }

      const appointment = this.appointmentRepo.create({
        tenantId,
        serviceId: service.id,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        startTime,
        endTime,
        status: 'scheduled',
      });

      const savedAppointment = await this.appointmentRepo.save(appointment);

      this.webhooksService.triggerAppointmentCreated(tenantId, savedAppointment).catch(err => {
        this.logger.error(`Webhook failed asynchronously: ${err.message}`);
      });

      return savedAppointment;

    } finally {
      await this.redisService.releaseLock(lockKey, lockId);
    }
  }
}
