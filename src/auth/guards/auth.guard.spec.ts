import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { UserType } from 'src/types';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const testUserPayload: UserPayload = {
    userId: 1,
    name: 'Test Kim',
    type: UserType.CUSTOMER,
  }

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
    it('should return false if no authorization.', () => {
      const context: ExecutionContext = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: {}
          })),
        })),
      } as any;

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it.todo('should return false if not bearer auth.');

    it.todo('should return false if expired access token.');

    it.todo('should return false if wrong signed access token.');

    it.todo('should return false if invalid user payload.');

    it.todo('should return true if valid access token.');
  });
});
