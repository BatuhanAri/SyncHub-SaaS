import { Controller, Get } from '@nestjs/common';
import { ServiceService } from './service.service';
import { GetTenantId } from '../common/decorators/tenant.decorator';
import { ApiTags, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Services')
@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant ID required for all requests',
  required: true,
})
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @ApiOperation({ summary: 'List all services for the tenant' })
  @ApiResponse({ status: 200, description: 'List of services' })
  async findAll(@GetTenantId() tenantId: string) {
    return this.serviceService.findAll(tenantId);
  }
}
