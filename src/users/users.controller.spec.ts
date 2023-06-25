import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { is } from 'typia';

import { PrismaService } from 'src/prisma';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { UserType } from 'src/types';

describe.skip('UsersController', () => {
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
    };
    const userTypes = Object.values(UserType);

    it('should throw Error if invalid user type.', async () => {
      // THIS WILL BE TESTED IN E2E LEVEL
      // const result = controller.signup(signupForm, { type: 'invalid' });
      // await expect(result).rejects.toThrowError();
    });

    it('should throw Error if undefined user type.', async () => {
      // THIS WILL BE TESTED IN E2E LEVEL
      // const result = controller.signup(signupForm, { type: undefined });
      // await expect(result).rejects.toThrowError();
    });

    it('should throw Error if duplicated user.', async () => {
      const type = userTypes[Math.floor(Math.random() * userTypes.length)];
      mockPrisma.user.findUnique.mockResolvedValueOnce(testUser);

      const result = controller.signup(signupForm, { type });

      await expect(result).rejects.toThrowError();
    });

    it('should throw Error if create fails.', async () => {
      const type = userTypes[Math.floor(Math.random() * userTypes.length)];
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockRejectedValueOnce(new Error());

      const result = controller.signup(signupForm, { type });

      await expect(result).rejects.toThrowError();
    });

    it('should return User if create success.', async () => {
      const type = userTypes[Math.floor(Math.random() * userTypes.length)];
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(testUser);

      const { result, data } = await controller.signup(signupForm, { type });

      expect(result).toBe(true);
      expect(is<User>(data)).toBe(true);
    });
  });
});
