import { UserEntity } from "../entity/user.entity";

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  readonly password?: string;

  constructor(userEntity: UserEntity) {
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.password = userEntity.password;
  }

  static from(userEntity: UserEntity) {
    return new UpdateUserDto(userEntity);
  }
}
