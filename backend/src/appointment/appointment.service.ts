import { Injectable, BadRequestException, ConflictException, Logger } from '@nestjs/common';
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

    // Distributed Locking: Prevent Race Conditions for the same service in the same tenant
    // Even better would be locking the exact timeslot, but locking the service is safer and simpler
    const lockKey = `lock:appointment:${tenantId}:${service.id}`;
    const lockId = await this.redisService.acquireLock(lockKey, 3000); // 3 seconds lock

    if (!lockId) {
      throw new ConflictException('Service is currently being booked by someone else. Please try again in a moment.');
    }

    try {
      // Check overlaps
      // An overlap occurs if an existing appointment starts before this one ends, AND ends after this one starts.
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

      // Create Appointment
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

      // Async Webhook trigger
      this.webhooksService.triggerAppointmentCreated(tenantId, savedAppointment).catch(err => {
        this.logger.error(`Webhook failed asynchronously: ${err.message}`);
      });

      return savedAppointment;

    } finally {
      await this.redisService.releaseLock(lockKey, lockId);
    }
  }
}
