// UserRepositoryService.ts

import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


export class UserDao {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  public async getUserCount() {
    return this.userRepository.count({ where: { deleted: false } });
  }

  public async getUserList(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { deleted: false } });
  }

  public async getUserEntityByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email, deleted: false });
  }

  public async deleteUserEntityByUserId(userEntity: UserEntity) {
    userEntity.deleted = true;
    await this.userRepository.save(userEntity);
  }
}