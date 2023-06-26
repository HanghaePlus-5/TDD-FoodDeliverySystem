import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthService {
  constructor() {}

  createAccessToken(user) {
    return true;
  }
}
