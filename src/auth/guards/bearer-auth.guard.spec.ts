import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';

import { EnvService } from 'src/config/env';
import { CustomConfigModule } from 'src/config';

import { BearerAuthGuard } from './bearer-auth.guard';
import { JwtStrategy } from '../passport';
import { JwtAuthService } from '../services';

import { UserType } from 'src/types';

describe('AuthGuard', () => {
  let guard: BearerAuthGuard;
  let jwtAuth: JwtAuthService;
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
      getResponse: jest.fn(),
    })),
  } as any) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [CustomConfigModule],
          useFactory: async (env: EnvService) => ({
            secret: env.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: env.get<string>('JWT_EXPIRES_IN'),
            },
          }),
          inject: [EnvService],
        }),
      ],
      providers: [
        BearerAuthGuard,
        JwtAuthService,
        JwtStrategy,
        Reflector,
      ],
    }).compile();

    guard = module.get<BearerAuthGuard>(BearerAuthGuard);
    jwtAuth = module.get<JwtAuthService>(JwtAuthService);
    reflector = module.get<Reflector>(Reflector);

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(jwtAuth).toBeDefined();
    expect(reflector).toBeDefined();
  });

  it('should return true if @IgnoreAuth is used.', async () => {
    const context = createContext('');
    reflector.getAllAndOverride = jest.fn().mockReturnValueOnce(true);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  describe('verify access token.', () => {
    it('should throw Error if no authorization.', async () => {
      const context: ExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: {},
          })),
        })),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrowError();
    });

    it('should throw Error if not bearer auth.', async () => {
      const context = createContext('not-bearer');

      await expect(guard.canActivate(context)).rejects.toThrowError();
    });

    it('should throw Error if invalid access token.', async () => {
      jest.spyOn(jwtAuth, 'verifyAccessToken').mockResolvedValueOnce(null);
      const context = createContext('Bearer invalid-token');

      await expect(guard.canActivate(context)).rejects.toThrowError();
    });

    it('should throw Error if invalid user payload.', async () => {
      const brokenUserPayload = {
        ...testUserPayload,
        type: 'broken' as UserType,
      };
      jest.spyOn(jwtAuth, 'verifyAccessToken').mockResolvedValueOnce(brokenUserPayload);
      const context = createContext('Bearer token-with-invalid-payload');

      await expect(guard.canActivate(context)).rejects.toThrowError();
    });

    it('should return true if valid access token.', async () => {
      jest.spyOn(jwtAuth, 'verifyAccessToken').mockResolvedValueOnce(testUserPayload);
      const context = createContext('Bearer valid-token');

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  it('should throw Error if invalid UserType.', async () => {
    jest.spyOn(jwtAuth, 'verifyAccessToken').mockResolvedValueOnce(testUserPayload);
    jest.spyOn(reflector, 'get').mockReturnValue([UserType.BUSINESS]);

    const context = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).rejects.toThrowError();
  });
});
