import { Injectable } from '@nestjs/common';
import { is } from 'typia';

@Injectable()
export class JwtAuthService {
  constructor() {}

  createAccessToken(user) {
    const payload = this.createUserPayload(user);
    if (!is<UserPayload>(payload)) {
      return null;
    }
    return true;
  }

  private createUserPayload(user: User) {
    return {
      userId: user.userId,
      name: user.name,
      type: user.type,
    }
  }
}
