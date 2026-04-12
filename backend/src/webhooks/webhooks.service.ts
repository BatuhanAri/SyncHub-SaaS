import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  async triggerAppointmentCreated(tenantId: string, payload: any) {
    const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:5678/webhook/appointment-created';
    const secret = process.env.WEBHOOK_SECRET || 'synchub-secret';

    const stringPayload = JSON.stringify(payload);
    
    // Create HMAC signature
    const signature = crypto
      .createHmac('sha256', secret)
      .update(stringPayload)
      .digest('hex');

    try {
      await axios.post(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
          'x-signature': signature,
        },
        timeout: 5000,
      });
      this.logger.log(`Webhook triggered successfully for tenant ${tenantId}`);
    } catch (error) {
      this.logger.error(`Failed to trigger webhook for tenant ${tenantId}: ${error.message}`);
      // In a real production system, you'd queue this for a retry
    }
  }
}
