import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserType } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { is } from 'typia';

import { PrismaService } from 'src/prisma';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  const testUser = {
    userId: 1,
    email: 'test1@delivery.com',
    name: 'Test Kim',
    password: 'qwe1234',
    type: UserType.CUSTOMER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    it('should throw Error if no user found.', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(controller.signin(signinForm)).rejects.toThrowError();
    });

    it.todo('should throw Error if failed to create token.');
    it.todo('should return User with "Set-Cookie" header set if success.');
  });
});
