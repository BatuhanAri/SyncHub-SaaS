import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async findAll(tenantId: string): Promise<Service[]> {
    return this.serviceRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }
}
