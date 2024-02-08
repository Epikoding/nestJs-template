import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './skip.guard';
import * as process from 'process';
import { Role } from '../../user/enum/role';
import { ROLES_KEY } from '../../user/enum/roles.decorator';
import { UserAuthorityService } from '../../user/service/user-authority.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
              private userAuthorityService: UserAuthorityService,
              private reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }


    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET
    });

    const userId = payload.sub;
    const userAuthorityEntityList = await this.userAuthorityService.findUserAuthoritiesByUserId(userId);
    if (!userAuthorityEntityList) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    if (requiredRoles === undefined || requiredRoles.length === 0 ) {
      return true;
    }

    return requiredRoles.some(role =>
      userAuthorityEntityList.some(userAuthorityEntity =>
        userAuthorityEntity.authority.role === role));
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
