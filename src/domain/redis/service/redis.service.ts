import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient = createClient();

  async onModuleInit() {
    this.redisClient.on('connect', () => console.info('Redis PubSub connected!'));
    this.redisClient.on('error', (err) => console.error('Redis PubSub Client Error', err));
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }

  async subscribe(channel: string) {
    await this.redisClient.subscribe(channel, (message) => {
      console.log('message:', message);
    });
    console.log('채널 연결 완료');
  }

  async unsubscribe(channel: string) {
    await this.redisClient.unsubscribe(channel);
  }

  async pSubscribe(pattern: string) {
    await this.redisClient.pSubscribe(pattern, (message, channel) => {
      console.log(`channel: ${channel}, message: ${message}`);
    });
    console.log('채널(패턴) 연결 완료');
  }

  async pUnsubscribe(pattern: string) {
    await this.redisClient.pUnsubscribe(pattern);
  }

  async publish(channel: string, message: string) {
    await this.redisClient.publish(channel, message);
  }
}
