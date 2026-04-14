import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string, tenantId?: string): Promise<User | null> {
    const where: any = { email };
    if (tenantId) {
      where.tenantId = tenantId;
    }
    return this.userRepo.findOne({ where });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    if (data.passwordHash) {
      data.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }
}
