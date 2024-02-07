import { UserEntity } from '../entity/user.entity';
import { BaseDto } from '../../../base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto extends BaseDto {

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password?: string;

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
