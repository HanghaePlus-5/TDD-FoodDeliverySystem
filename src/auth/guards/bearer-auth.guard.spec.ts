import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { BearerAuthGuard } from './bearer-auth.guard';
import { JwtAuthService } from '../services';

import { UserType } from 'src/types';

describe('AuthGuard', () => {
  let guard: BearerAuthGuard;
  let jwt: JwtAuthService;
  let reflector: Reflector;

  const testUserPayload: UserPayload = {
    userId: 1,
    name: 'Test Kim',
    type: UserType.CUSTOMER,
  };

  const createContext = (authorization: string) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        headers: { authorization },
      })),
    })),
  } as any) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BearerAuthGuard,
        JwtService,
        JwtAuthService,
        Reflector,
      ],
    }).compile();

    guard = module.get<BearerAuthGuard>(BearerAuthGuard);
    jwt = module.get<JwtAuthService>(JwtAuthService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(jwt).toBeDefined();
    expect(reflector).toBeDefined();
  });

  it('should return true if @IgnoreAuth is used.', async () => {
    const context = createContext('');
    reflector.getAllAndOverride = jest.fn().mockReturnValueOnce(true);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  describe('verify access token.', () => {
    it('should return false if no authorization.', async () => {
      const context: ExecutionContext = {
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: {},
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

    it('should return false if invalid access token.', async () => {
      jwt.verifyAccessToken = jest.fn().mockResolvedValueOnce(null);
      const context = createContext('Bearer invalid-token');

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false if invalid user payload.', async () => {
      const brokenUserPayload = {
        ...testUserPayload,
        type: 'broken',
      };
      jwt.verifyAccessToken = jest.fn().mockResolvedValueOnce(brokenUserPayload);
      const context = createContext('Bearer token-with-invalid-payload');

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return true if valid access token.', async () => {
      jwt.verifyAccessToken = jest.fn().mockResolvedValueOnce(testUserPayload);
      const context = createContext('Bearer valid-token');

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
