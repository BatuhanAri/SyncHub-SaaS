import { Injectable, NestMiddleware, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include tenantId
declare module 'express' {
  export interface Request {
    tenantId?: string;
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('x-tenant-id header is missing');
    }

    if (typeof tenantId !== 'string') {
      throw new BadRequestException('Invalid x-tenant-id format');
    }

    req.tenantId = tenantId;
    next();
  }
}
