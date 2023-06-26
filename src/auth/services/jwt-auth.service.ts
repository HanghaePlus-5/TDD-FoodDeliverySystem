import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { is } from 'typia';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwt: JwtService,
  ) {}

  async createAccessToken(user: User) {
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
