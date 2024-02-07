// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../../user/service/user.service';
//
// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private jwtService: JwtService
//   ) {}
//
//   async signIn(
//     email: string,
//     password: string,
//   ): Promise<{ access_token: string }> {
//     const user = await this.userService.findUserByEmail(email);
//     if (user?.password !== password) {
//       throw new UnauthorizedException();
//     }
//     const payload = { sub: user.userId, username: user.username };
//     return {
//       access_token: await this.jwtService.signAsync(payload),
//     };
//   }
// }