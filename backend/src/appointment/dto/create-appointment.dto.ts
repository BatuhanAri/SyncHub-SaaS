import { IsString, IsEmail, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  serviceId: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsDateString()
  startTime: Date;
}
