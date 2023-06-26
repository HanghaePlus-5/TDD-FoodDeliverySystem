import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { CustomConfigModule } from 'src/config';

import { JwtAuthService } from './jwt-auth.service';

import { UserType } from 'src/types';
import { AuthModule } from '../auth.module';

describe('AuthService', () => {
  let service: JwtAuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CustomConfigModule,
        AuthModule,
      ],
      providers: [
        JwtAuthService,
        JwtService,
      ],
    })
      .compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create Access Token', () => {
    const signedUser: User = {
      userId: 1,
      email: 'test@delivery.com',
      name: 'Test Kim',
      password: 'HASHED_PASSWORD',
      type: UserType.CUSTOMER,
    };

    it('should return null if invalid user payload.', async () => {
      const brokenUser = {
        ...signedUser,
        type: 'broken',
      };

      const result = await service.createAccessToken(brokenUser as User);

      expect(result).toBe(null);
    });

    it('should return null if fail to create token.', async () => {
      jwtService.signAsync = jest.fn().mockRejectedValueOnce(new Error());

      const result = await service.createAccessToken(signedUser);

      expect(result).toBe(null);
    });

    it('should return jwt token if success.', async () => {
      const result = await service.createAccessToken(signedUser);
      console.log('created token', result);

      expect(result).toBeDefined();
      expect(jwtService.verify(result!)).toBeTruthy();
    });
  });

  describe('Verify Access Token', () => {
    const options: JwtSignOptions = {
      expiresIn: '10m',
    }

    const payload: UserPayload = {
      userId: 1,
      name: 'John Doe',
      type: UserType.CUSTOMER,
    }

    it('should return null if expired token.', async () => {
      const optionsCopy: JwtSignOptions = {
        ...options,
        expiresIn: '0s',
      }
      const token = jwtService.sign(payload, optionsCopy);

      const result = await service.verifyAccessToken(token);

      expect(result).toBe(null);
    });

    it('should return null if mismatch secert key.', async () => {
      const optionsCopy: JwtSignOptions = {
        ...options,
        secret: 'wrong secret key',
      }
      const token = jwtService.sign(payload, optionsCopy);

      const result = await service.verifyAccessToken(token);

      expect(result).toBe(null);
    });

    it('should return null if invalid user payload.', async () => {
      const brokenPayload = {
        ...payload,
        type: 'broken',
      }
      const token = jwtService.sign(brokenPayload, options);

      const result = await service.verifyAccessToken(token);

      expect(result).toBe(null);
    });
    it.todo('should return UserPayload if success.');
  });
});
