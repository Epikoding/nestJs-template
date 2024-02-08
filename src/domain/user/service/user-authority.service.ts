import
{ Injectable } from '@nestjs/common';
import { UserAuthorityEntity } from '../entity/user-authority.entity';
import { UserAuthorityDao } from '../repository/user-authority.repository';


@Injectable()
export class UserAuthorityService {
  constructor(private userAuthorityDao: UserAuthorityDao) {}


  async findUserAuthoritiesByUserId(userId: number): Promise<UserAuthorityEntity[]> {
    return this.userAuthorityDao.findByUserId(userId);
  }
}
