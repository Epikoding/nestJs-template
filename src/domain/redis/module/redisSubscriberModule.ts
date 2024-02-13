import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisController } from '../controller/redis.controller';
import { RedisService } from '../service/redis.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEST_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        }
      },
    ]),
  ],
  controllers: [RedisController],
  providers: [RedisService]
})
export class RedisSubscriberModule {
}