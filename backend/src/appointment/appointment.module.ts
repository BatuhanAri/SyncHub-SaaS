import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { Service } from '../service/entities/service.entity';
import { RedisModule } from '../common/redis/redis.module';
import { WebhooksModule } from '../webhooks/webhooks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Service]),
    RedisModule,
    WebhooksModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
