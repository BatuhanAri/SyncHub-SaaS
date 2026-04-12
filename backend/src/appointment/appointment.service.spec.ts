import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Service } from '../service/entities/service.entity';
import { RedisService } from '../common/redis/redis.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { ConflictException } from '@nestjs/common';

describe('AppointmentService', () => {
  let service: AppointmentService;

  const mockAppointmentRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockServiceRepo = {
    findOne: jest.fn(),
  };

  const mockRedisService = {
    acquireLock: jest.fn(),
    releaseLock: jest.fn(),
  };

  const mockWebhooksService = {
    triggerAppointmentCreated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getRepositoryToken(Appointment), useValue: mockAppointmentRepo },
        { provide: getRepositoryToken(Service), useValue: mockServiceRepo },
        { provide: RedisService, useValue: mockRedisService },
        { provide: WebhooksService, useValue: mockWebhooksService },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should throw ConflictException if lock cannot be acquired (redis race condition)', async () => {
      mockServiceRepo.findOne.mockResolvedValue({ id: 'service-1', durationMinutes: 30 });
      mockRedisService.acquireLock.mockResolvedValue(null); // Lock held by someone else

      const dto = {
        serviceId: 'service-1',
        customerName: 'TestUser',
        customerEmail: 'test@example.com',
        startTime: new Date('2025-01-01T10:00:00Z'),
      };

      await expect(service.createAppointment('tenant-1', dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if time overlaps in DB', async () => {
      mockServiceRepo.findOne.mockResolvedValue({ id: 'service-1', durationMinutes: 30 });
      mockRedisService.acquireLock.mockResolvedValue('lock-uuid-1');
      mockAppointmentRepo.findOne.mockResolvedValue({ id: 'existing-appointment' }); // Simulation: DB overlap found

      const dto = {
        serviceId: 'service-1',
        customerName: 'TestUser',
        customerEmail: 'test@example.com',
        startTime: new Date('2025-01-01T10:00:00Z'),
      };

      await expect(service.createAppointment('tenant-1', dto)).rejects.toThrow(ConflictException);
      expect(mockRedisService.releaseLock).toHaveBeenCalledWith('lock:appointment:tenant-1:service-1', 'lock-uuid-1');
    });
  });
});
