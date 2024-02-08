import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Result } from '../../../base.result';
import { GetUserDto } from '../dto/get-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthorityService } from './authority.service';
import { Role } from '../enum/role';
import { UserDao } from '../repository/user.repository';
import { LoginRequestDto } from '../dto/login-request.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
              private userDao: UserDao,
              private authorityService: AuthorityService,
              private jwtService: JwtService) {
  }

  public async createUser(createUserDto: CreateUserDto): Promise<Result<CreateUserDto>> {
    const { email, name, password } = createUserDto;

    if (email) {
      const existingUser: UserEntity = await this.userDao.getUserEntityByEmail(email);

      if (existingUser) {
        throw new ConflictException(`해당 이메일로 존재하는 유저가 있습니다. 아이디 값은 ${existingUser.id}입니다.`);
      }
    }

    const authorityEntity = await this.authorityService.findOneByRole(Role.TEMPORARY);
    const userEntity = new UserEntity(name, email, password, authorityEntity);

    await this.userRepository.save(userEntity);

    const userDto = CreateUserDto.from(userEntity);
    return Result.success(userDto);
  }

  public async login(dto: LoginRequestDto): Promise<{ access_token: string }> {

    const email = dto.email;
    const password = dto.password;

    const userEntity = await this.userDao.getUserEntityByEmail(email);
    if (!userEntity) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }

    if (userEntity.password !== password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { sub: userEntity.id, username: userEntity.name };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  public async findUserList(): Promise<Result<GetUserDto[]>> {
    const userEntityList: UserEntity[] = await this.userDao.getUserList();
    if (userEntityList == null) {
      return Result.error(HttpStatus.NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    return Result.success(userEntityList.map(v => GetUserDto.createInstance(v.id, v.email, v.name)));
  }

  public async findUserByEmail(email: string): Promise<Result<GetUserDto>> {
    const userEntity = await this.userDao.getUserEntityByEmail(email);
    if (userEntity == null) {
      throw new NotFoundException(`${email}로 유저 정보를 찾을 수 없습니다`);
    }
    const userDto = GetUserDto.createInstance(userEntity.id, userEntity.email, userEntity.name);

    return Result.success(userDto);
  }

  public async updateUser(email: string, updateUserDto: UpdateUserDto): Promise<Result<UpdateUserDto>> {
    const userEntity = await this.userDao.getUserEntityByEmail(email);
    if (userEntity == null) {
      throw new NotFoundException(`${email}로 유저 정보를 찾을 수 없습니다`);
    }

    Object.keys(updateUserDto).forEach(key => {
      if (updateUserDto[key] !== null) {
        userEntity[key] = updateUserDto[key];
      }
    });

    await this.userRepository.save(userEntity);

    const userDto = UpdateUserDto.createInstance(userEntity.id, userEntity.email);
    return Result.success(userDto);
  }

  public async deleteUserByEmail<T>(email: string): Promise<Result<T>> {
    const userEntity = await this.userDao.getUserEntityByEmail(email);
    if (userEntity == null) {
      throw new NotFoundException('삭제할 유저가 없습니다.');
    }

    await this.userDao.deleteUserEntityByUserId(userEntity);

    return Result.success();
  }

  public async findUserCount(): Promise<Result<GetUserDto>> {
    const userCount = await this.userDao.getUserCount();
    const userDto = GetUserDto.withCountOnly(userCount);

    return Result.success(userDto);
  }

  async findUserById(userId: number) {
    return await this.userDao.getUserEntityById(userId);
  }
}
