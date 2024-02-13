import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../service/redis.service';


@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('/sub')
  async subscribe() {
    await this.redisService.subscribe('me');
    return 'Subscribed to channel me';
  }

  @Get('/unsub')
  async unsubscribe() {
    await this.redisService.unsubscribe('me');
    return 'Unsubscribed from channel me';
  }

  @Get('/psub')
  async pSubscribe() {
    await this.redisService.pSubscribe('m*');
    return 'Subscribed to pattern m*';
  }

  @Get('/punsub')
  async pUnsubscribe() {
    await this.redisService.pUnsubscribe('m*');
    return 'Unsubscribed from pattern m*';
  }

  @Get('/pub')
  async publish() {
    await this.redisService.publish('me', 'hello world');
    return 'Message published';
  }
}
