import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/module/user.module';
import { UserEntity } from './domain/user/entity/user.entity';
import { AuthorityEntity } from './domain/user/entity/authority.entity';
import { UserAuthorityEntity } from './domain/user/entity/user-authority.entity';
import { LoggingMiddleware } from './domain/user/middleware/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available throughout your application
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'), // the '+' converts string to number
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true, // Be careful with this in production!
        logging: true,
        entities: [UserEntity, AuthorityEntity, UserAuthorityEntity]
      }),
      inject: [ConfigService]
    }),
    UserModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}