import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { CustomConfigModule } from 'src/config';

import { JwtAuthService } from './jwt-auth.service';

import { UserType } from 'src/types';

describe('AuthService', () => {
  let service: JwtAuthService;

  const mockJwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CustomConfigModule,
      ],
      providers: [
        JwtAuthService,
        JwtService,
      ],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwt)
      .compile();

    service = module.get<JwtAuthService>(JwtAuthService);
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
      mockJwt.signAsync.mockImplementationOnce(() => Promise.reject());

      const result = await service.createAccessToken(signedUser);

      expect(result).toBe(null);
    });

    it('should return jwt token if success.', async () => {
      mockJwt.signAsync.mockImplementationOnce(() => Promise.resolve('TOKEN'));

      const result = await service.createAccessToken(signedUser);

      expect(result).toBe('TOKEN');
    });
  });

  describe('Verify Access Token', () => {
    
    it('should return false if expired token.', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcklkIjoxLCJuYW1lIjoiSm9obiBEb2UiLCJ0eXBlIjoiQ1VTVE9NRVIiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.-2DPqhCQETlTNEzziiH0WU1nUffgHHDYqN8XZ5YhFfA';

      const result = await service.verifyAccessToken(token);

      expect(result).toBe(false);
    });
    it.todo('should return false if mismatch secert key.');
    it.todo('should return false if invalid user payload.');
    it.todo('should return UserPayload if success.');
  });
});
