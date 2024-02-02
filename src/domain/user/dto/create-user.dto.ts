import { UserEntity } from '../entity/user.entity';
import { BaseDto } from '../../../base.dto';

export class CreateUserDto extends BaseDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  // createUser
  constructor(userEntity: UserEntity) {
    super(userEntity.id, userEntity.createdAt, userEntity.modifiedAt);
    this.name = userEntity.name;
    this.email = userEntity.email;
  }

  static from(userEntity: UserEntity) {
    return new CreateUserDto(userEntity);
  }
}
