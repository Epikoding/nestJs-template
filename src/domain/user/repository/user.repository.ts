// UserRepositoryService.ts

import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


export class UserDao {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async getUserCount() {
    return this.userRepository.count({ where: { deleted: false } });
  }

  async getUserList(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { deleted: false } });
  }

  async getUserEntityByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email, deleted: false });
  }

  async deleteUserEntityByUserId(userEntity: UserEntity) {
    userEntity.deleted = true;
    await this.userRepository.save(userEntity);
  }

  async getUserEntityById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId, deleted: false } });
  }
}