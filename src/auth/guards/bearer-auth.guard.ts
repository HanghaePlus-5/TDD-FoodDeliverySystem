import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';
import { Request } from 'express';
import { is } from 'typia';

import { JwtAuthService } from '../services';

@Injectable()
export class BearerAuthGuard extends PassportGuard('jwt') {
  constructor(
    private readonly jwt: JwtAuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (authorization === undefined) return false;

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') return false;

    const user = await this.jwt.verifyAccessToken(token);
    if (!is<UserPayload>(user)) return false;

    return true;
  }
}
