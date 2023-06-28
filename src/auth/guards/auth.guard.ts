import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as PassportGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtAuthService } from '../services';
import { is } from 'typia';

@Injectable()
export class AuthGuard extends PassportGuard('jwt') {
  constructor(
    private readonly jwt: JwtAuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;
    if (authorization === undefined) return false;

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') return false;

    const user = await this.jwt.verifyAccessToken(token);
    if (!is<UserPayload>(user)) return false;

    return true;
  }
}
