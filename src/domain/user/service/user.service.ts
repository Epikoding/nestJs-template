import { ConflictException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { Result } from "../../../base.result";
import { GetUserDto } from "../dto/get-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";


@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
  }

  public async createUser(createUserDto: CreateUserDto): Promise<Result<CreateUserDto>> {
    const email = createUserDto.email;
    if (email != null) {
      const existingUser: UserEntity = await this.getUserEntityByEmail(email);

      if (existingUser != null) {
        throw new ConflictException("해당 이메일로 존재하는 유저가 있습니다. 아이디 값은 " + existingUser.id + "입니다.");
      }
    }

    const userEntity = this.userRepository.create(createUserDto);
    await this.userRepository.save(userEntity);

    const userDto = CreateUserDto.from(userEntity);
    return Result.success(userDto);
  }

  public async findUserList(): Promise<Result<GetUserDto[]>> {
    const userEntityList: UserEntity[] = await this.getUserList();
    if (userEntityList == null) {
      return Result.error(HttpStatus.NOT_FOUND, "유저를 찾을 수 없습니다.");
    }

    return Result.success(userEntityList.map(v => GetUserDto.createInstance(v.id, v.email, v.name)));
  }

  public async findUserByEmail(email: string): Promise<Result<GetUserDto>> {
    const userEntity = await this.getUserEntityByEmail(email);
    const userDto = GetUserDto.createInstance(userEntity.id, userEntity.email, userEntity.name);

    return Result.success(userDto);
  }

  public async updateUser(email: string, updateUserDto: UpdateUserDto): Promise<Result<UpdateUserDto>> {
    const userEntity = await this.getUserEntityByEmail(email);
    if (userEntity == null) {
      throw new NotFoundException(`${email}로 유저 정보를 찾을 수 없습니다`);
    }

    Object.keys(updateUserDto).forEach(key => {
      if (updateUserDto[key] !== null) {
        userEntity[key] = updateUserDto[key];
      }
    });

    await this.userRepository.save(userEntity);

    const userDto = UpdateUserDto.from(userEntity);
    return Result.success(userDto);
  }

  public async deleteUserByEmail<T>(email: string): Promise<Result<T>> {
    const userEntity = await this.getUserEntityByEmail(email);
    if (userEntity == null) {
      throw new NotFoundException("삭제할 유저가 없습니다.");
    }

    await this.deleteUserEntityByUserId(userEntity);

    return Result.success();
  }

  public async findUserCount(): Promise<Result<GetUserDto>> {
    const userCount = await this.getUserCount();
    const userDto = GetUserDto.withCountOnly(userCount);
    
    return Result.success(userDto);
  }

  private async getUserCount() {
    return this.userRepository.count({ where: { deleted: false } });
  }

  private async getUserList(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { deleted: false } });
  }

  private async getUserEntityByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email, deleted: false });
  }

  private async deleteUserEntityByUserId(userEntity: UserEntity) {
    userEntity.deleted = true;
    await this.userRepository.save(userEntity);
  }
}
