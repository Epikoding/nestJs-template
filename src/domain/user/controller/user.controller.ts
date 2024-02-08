import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Result } from '../../../base.result';
import { GetUserDto } from '../dto/get-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { Roles } from '../enum/roles.decorator';
import { Role } from '../enum/role';
import { Public } from '../../auth/jwt/skip.guard';

import { AuthGuard } from '../../auth/jwt/jwt.guard';


@Controller("user")
export class UserController {
  constructor(private readonly appService: UserService) {
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async findUserByEmail(@Query("email") email: string): Promise<Result<GetUserDto>> {
    return this.appService.findUserByEmail(email);
  }

  @Public()
  @Post("/login")
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<{ access_token: string }>{
    return this.appService.login(loginRequestDto);
  }

  @Get("/list")
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  async findUserList(): Promise<Result<GetUserDto[]>> {
    return this.appService.findUserList();
  }

  // @Roles(Role.ADMIN, Role.USER, Role.TEMPORARY)
  @UseGuards(AuthGuard)
  @Get("/count")
  async findUserCount(): Promise<Result<GetUserDto>> {
    return this.appService.findUserCount();
  }


  @Roles(Role.ADMIN)
  @Post()
  async saveUser(@Body() createUserDto: CreateUserDto): Promise<Result<CreateUserDto>> {
    return this.appService.createUser(createUserDto);
  }

  // @UseGuards(AuthGuard)
  @Patch()
  async updateUserByEmail(@Query("email") email: string,
                          @Body() updateUserDto: UpdateUserDto): Promise<Result<UpdateUserDto>> {
    return this.appService.updateUser(email, updateUserDto);
  }

  // @UseGuards(AuthGuard)
  @Delete()
  async deleteUserByEmail<T>(@Query("email") email: string): Promise<Result<T>> {
    return this.appService.deleteUserByEmail(email);
  }
}
