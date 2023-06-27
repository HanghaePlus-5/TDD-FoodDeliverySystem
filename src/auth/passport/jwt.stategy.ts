import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { is } from 'typia';

import { EnvService } from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly env: EnvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    if (is<UserPayload>(payload)) {
      return { ...payload };
    }
    throw new UnauthorizedException('Invalid token payload');
  }
}
