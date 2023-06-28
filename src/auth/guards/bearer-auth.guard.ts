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
    const isIgnoreAuth = this.reflector.getAllAndOverride<boolean>(IGNORE_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isIgnoreAuth) return true;

    const req: Request = context.switchToHttp().getRequest();
    const result = await this.verifyToken(req);

    if (result) {
      super.canActivate(context);
      return true;
    }

    throw new UnauthorizedException();
  }

  private async verifyToken(req: Request) {
    const { authorization } = req.headers;
    if (authorization === undefined) return false;

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') return false;

    const user = await this.jwt.verifyAccessToken(token);
    if (!is<UserPayload>(user)) return false;

    return true;
  }

  public handleRequest(err: any, user: any, info: undefined|Error) {
    // console.log('jwt auth guard handle request', err, user, info);
    if (err) return null;
    if (user && info === undefined) return user;
    return null;
  }
}
