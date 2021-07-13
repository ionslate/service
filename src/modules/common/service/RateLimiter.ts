import { Request, Response } from 'express-serve-static-core';
import { Redis } from 'ioredis';
import { TooManyRequest } from '../../../error/exceptions/TooManyRequests';

export class RateLimiter {
  constructor(
    private redisClient: Redis,
    private req: Request,
    private res: Response,
  ) {}

  /**
   * Sets a rate limit for a given user's ip.
   *
   * @param key - The name of the key
   * @param limit - The number of calls per window
   * @param window - The amount of time the limit should be set for (in seconds)
   * @returns void
   *
   * @beta
   */
  async limit(key: string, limit: number, window: number): Promise<void> {
    const limitKey = `rate-limit:${key}:${this.req.ip}`;
    const windowInSeconds = Math.ceil(window);

    const current = await this.redisClient.incr(limitKey);

    if (current > limit) {
      const ttl = await this.redisClient.ttl(limitKey);

      this.res.setHeader('Retry-After', ttl);
      throw new TooManyRequest(ttl);
    } else if (current <= 1) {
      await this.redisClient.expire(limitKey, windowInSeconds);
    }
  }
}
