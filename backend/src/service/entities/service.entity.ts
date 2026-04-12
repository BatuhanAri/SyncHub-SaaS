import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'duration_minutes', type: 'int', default: 30 })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
