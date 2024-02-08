import { UserAuthorityEntity } from '../entity/user-authority.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class UserAuthorityDao {
  constructor(@InjectRepository(UserAuthorityEntity) private userAuthorityRepository: Repository<UserAuthorityEntity>) {}

  async findByUserId(userId: number): Promise<UserAuthorityEntity[]> {
    return this.userAuthorityRepository
      .createQueryBuilder('userAuthority')
      .leftJoinAndSelect('userAuthority.user', 'user')
      .leftJoinAndSelect('userAuthority.authority', 'authority')
      .where('userAuthority.user.id = :userId', { userId })
      .getMany();
  }
}