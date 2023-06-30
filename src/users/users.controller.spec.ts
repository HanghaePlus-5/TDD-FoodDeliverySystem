import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaClient, UserType } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { is } from 'typia';

import { PrismaService } from 'src/prisma';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthService } from 'src/auth/services';
import { bcryptHash } from 'src/lib/bcrypt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockPrisma: DeepMockProxy<PrismaClient>;
  let mockJwt: JwtAuthService;

  const testUser = {
    userId: 1,
    email: 'test1@delivery.com',
    name: 'Test Kim',
    password: 'qwe1234',
    type: UserType.CUSTOMER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<UsersController>(UsersController);
    mockPrisma = module.get(PrismaService);
    mockJwt = module.get(JwtAuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupForm = {
      email: 'test1@delivery.com',
      name: 'Test Kim',
      password: 'qwe1234',
      type: UserType.CUSTOMER,
    };
    const userTypes = Object.values(UserType);

    it('should throw Error if invalid user type.', async () => {
      // THIS WILL BE TESTED IN E2E LEVEL
      // const formCopy = {
      //   ...signupForm,
      //   type: 'invalid' as UserType
      // };
      // console.log(validate<UserCreateDto>(formCopy));
      // await expect(controller.signup(formCopy)).rejects.toThrowError();
    });

    it('should throw Error if undefined user type.', async () => {
      // THIS WILL BE TESTED IN E2E LEVEL
      // const result = controller.signup(signupForm, { type: undefined });
      // await expect(result).rejects.toThrowError();
    });

    it('should throw Error if duplicated user.', async () => {
      const type = userTypes[Math.floor(Math.random() * userTypes.length)];
      mockPrisma.user.findUnique.mockResolvedValueOnce(testUser);

      const result = controller.signup(signupForm);

      await expect(result).rejects.toThrowError();
    });

    it('should throw Error if create fails.', async () => {
      const type = userTypes[Math.floor(Math.random() * userTypes.length)];
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockRejectedValueOnce(new Error());

      const result = controller.signup(signupForm);

      await expect(result).rejects.toThrowError();
    });

    it('should return User if create success.', async () => {
      const type = userTypes[Math.floor(Math.random() * userTypes.length)];
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(testUser);

      const { result, data } = await controller.signup(signupForm);

      expect(result).toBe(true);
      expect(is<User>(data)).toBe(true);
    });
  });

  describe('signin', () => {
    const signinForm = {
      email: 'test@delivery.com',
      password: 'qwe1234',
    };

    const mockRes = {} as Response;

    it('should throw Error if no user found.', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(controller.signin(signinForm, mockRes)).rejects.toThrowError();
    });

    it('should throw Error if failed to create token.', async () => {
      const hashedUser = {
        ...testUser,
        password: await bcryptHash(testUser.password),
      };
      mockPrisma.user.findUnique.mockResolvedValueOnce(hashedUser);
      mockJwt.createAccessToken = jest.fn(() => Promise.resolve(null));

      await expect(controller.signin(signinForm, mockRes)).rejects.toThrowError();
    });

    it('should return User with res.cookie called if success.', async () => {
      const hashedUser = {
        ...testUser,
        password: await bcryptHash(testUser.password),
      };
      mockPrisma.user.findUnique.mockResolvedValueOnce(hashedUser);
      mockJwt.createAccessToken = jest.fn(() => Promise.resolve('token'));
      mockRes.cookie = jest.fn();

      const result: any = await controller.signin(signinForm, mockRes);

      expect(mockRes.cookie).toBeCalledWith('accessToken', 'token', { maxAge: 1000 * 60 * 60 });
      expect(is<User>(result.data)).toBe(true);
    });
  });
});
