import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtAuthService } from '../services';
import { UserType } from 'src/types';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwt: JwtAuthService;

  const testUserPayload: UserPayload = {
    userId: 1,
    name: 'Test Kim',
    type: UserType.CUSTOMER,
  }

  const createContext = (authorization: string) => ({
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        headers: { authorization }
      })),
    })),
  } as any) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        JwtService,
        JwtAuthService,
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwt = module.get<JwtAuthService>(JwtAuthService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(jwt).toBeDefined();
  });

  describe('verify access token.', () => {
    it('should return false if no authorization.', async () => {
      const context: ExecutionContext = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: {}
          })),
        })),
      } as any;

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false if not bearer auth.', async () => {
      const context = createContext('not-bearer');

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false if expired access token.', async () => {
      jwt.verifyAccessToken = jest.fn().mockResolvedValueOnce(null);
      const context = createContext('Bearer expired-token');

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it.todo('should return false if wrong signed access token.');

    it.todo('should return false if invalid user payload.');

    it.todo('should return true if valid access token.');
  });
});
