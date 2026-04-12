import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || 'redispassword',
    });
    this.logger.log('Redis connected');
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  /**
   * Acquires a lock for a given key.
   * Returns a Lock ID (UUID) string if successful, or null if it fails.
   */
  async acquireLock(key: string, ttlMs: number = 5000): Promise<string | null> {
    const lockId = crypto.randomUUID();
    const result = await this.redisClient.set(key, lockId, 'PX', ttlMs, 'NX');
    if (result === 'OK') {
      return lockId;
    }
    return null;
  }

  /**
   * Releases the lock by validating the Lock ID.
   * Uses Lua script to ensure atomicity (only the one who locked it can unlock it).
   */
  async releaseLock(key: string, lockId: string): Promise<boolean> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1]
      then
          return redis.call("del", KEYS[1])
      else
          return 0
      end
    `;
    const result = await this.redisClient.eval(script, 1, key, lockId);
    return result === 1;
  }
}
