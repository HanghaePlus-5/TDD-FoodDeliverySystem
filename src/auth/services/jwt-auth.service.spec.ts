import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthService } from './jwt-auth.service';

describe('AuthService', () => {
  let service: JwtAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthService],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Access Token', () => {
    it.todo('should return null if invalid user payload.');
    it.todo('should return null if fail to create token.');
    it.todo('should return jwt token if success.');
  });

  describe('Verify Access Token', () => {
    it.todo('should return false if expired token.');
    it.todo('should return false if mismatch secert key.');
    it.todo('should return false if invalid user payload.');
    it.todo('should return UserPayload if success.');
  });
});
