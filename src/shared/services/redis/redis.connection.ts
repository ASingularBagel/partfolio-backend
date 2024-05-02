import Logger from 'bunyan';
import { config } from '@root/config';
import { BaseCache } from '@services/redis/base.cache';

const log: Logger = config.createLogger('REDIS_CONNECTION');

class RedisConnection extends BaseCache {
  constructor() {
    super('REDIS_CONNECTION');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      log.info('Connected to redis');
    } catch (error) {
      log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
