import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/config/env';
import { is } from 'typia';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly env: EnvService,
  ) {}

  async createAccessToken(user) {
    const payload = this.createUserPayload(user);
    if (!is<UserPayload>(payload)) {
      return null;
    }

    try {
      const token = await this.jwt.signAsync(payload);
      return token;
      
    } catch (error) {
      return null;
    }
  }

  private createUserPayload(user: User) {
    return {
      userId: user.userId,
      name: user.name,
      type: user.type,
    }
  }
}
