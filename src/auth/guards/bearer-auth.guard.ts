import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportGuard } from '@nestjs/passport';
import { Request } from 'express';
import { is } from 'typia';

import { IGNORE_AUTH_KEY } from '../decorators';
import { JwtAuthService } from '../services';

@Injectable()
export class BearerAuthGuard extends PassportGuard('jwt') {
  constructor(
    private readonly jwt: JwtAuthService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isIgnoreAuth = this.ignoreAuthCheck(context);
    if (isIgnoreAuth) return true;

    const userPayload = await this.verifyToken(context);
    if (userPayload === null) {
      throw new UnauthorizedException();
    }

    const isValidUser = this.checkUserType(context, userPayload);
    if (!isValidUser) {
      throw new UnauthorizedException();
    }

    super.canActivate(context);
    return true;
  }

  private ignoreAuthCheck(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IGNORE_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private checkUserType(context: ExecutionContext, userPayload: UserPayload) {
    const userType = this.reflector.get<UserType[]>('userType', context.getHandler());
    return !!((
      userType === undefined
      || userPayload.type === userType[0]
    ));
  }

  private async verifyToken(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (authorization === undefined) return null;

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') return null;

    const user = await this.jwt.verifyAccessToken(token);
    if (!is<UserPayload>(user)) return null;

    return user;
  }

  public handleRequest(err: any, user: any, info: undefined|Error) {
    // console.log('jwt auth guard handle request', err, user, info);
    if (err) return null;
    if (user && info === undefined) return user;
    return null;
  }
}
