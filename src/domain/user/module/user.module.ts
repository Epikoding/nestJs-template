import { Module } from '@nestjs/common';
import { AuthorityEntity } from '../entity/authority.entity';
import { UserAuthorityEntity } from '../entity/user-authority.entity';
import { UserEntity } from '../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { AuthorityService } from '../service/authority.service';
import { AuthorityDataSeederService } from '../../data/data.seeder.service';
import { UserDao } from '../repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserAuthorityService } from '../service/user-authority.service';
import { UserAuthorityDao } from '../repository/user-authority.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../auth/jwt/jwt.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserAuthorityEntity, AuthorityEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      })
    })
  ],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // },
    UserService, AuthorityService, UserAuthorityService, UserDao, UserAuthorityDao, AuthorityDataSeederService]
})
export class UserModule {
}