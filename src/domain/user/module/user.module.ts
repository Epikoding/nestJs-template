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

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAuthorityEntity, AuthorityEntity])],
  controllers: [UserController],
  providers: [UserService, AuthorityService, UserDao, AuthorityDataSeederService],
})
export class UserModule {}