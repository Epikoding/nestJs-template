import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domain/user/module/role.module';
import { UserEntity } from './domain/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available throughout your application
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // You can also make this dynamic if you want
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'), // the '+' converts string to number
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: true, // Be careful with this in production!
        logging: true,
        entities: [UserEntity],
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}
