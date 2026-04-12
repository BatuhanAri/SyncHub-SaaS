import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { Service } from '../../service/entities/service.entity';
import { User } from '../../user/entities/user.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customerName: string;

  @Column({ name: 'customer_email', type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ name: 'customer_phone', type: 'varchar', length: 50, nullable: true })
  customerPhone: string;

  @Column({ name: 'start_time', type: 'timestamptz' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamptz' })
  endTime: Date;

  @Column({ type: 'varchar', length: 50, default: 'scheduled' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
