import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant/entities/tenant.entity';
import { User } from './user/entities/user.entity';
import { Service } from './service/entities/service.entity';
import { Appointment } from './appointment/entities/appointment.entity';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { RedisModule } from './common/redis/redis.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'synchub',
      entities: [Tenant, User, Service, Appointment],
      synchronize: false, // In production, use migrations
    }),
    RedisModule,
    WebhooksModule,
    AppointmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: '/', method: RequestMethod.GET }) // Exclude health check
      .forRoutes('*'); // Apply to all other routes
  }
}
