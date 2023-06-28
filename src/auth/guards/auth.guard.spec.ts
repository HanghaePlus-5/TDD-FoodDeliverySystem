import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('verify access token.', () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(),
      })),
    } as any;

    it.todo('should return false if no access token.');

    it.todo('should return false if expired access token.');

    it.todo('should return false if wrong signed access token.');

    it.todo('should return false if invalid user payload.');

    it.todo('should return true if valid access token.');
  });
});
