import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { is } from 'typia';

import { PrismaService } from 'src/prisma';

import { UsersService } from './users.service';

import { UserType } from 'src/types';

describe('UsersService', () => {
  let service: UsersService;
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
      providers: [
        UsersService,
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<UsersService>(UsersService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Shared Units', () => {
    describe('Check UserType', () => {
      it('should return false if UserType is undefined.', () => {
        const userType = undefined;

        const result = is<UserType>(userType);

        expect(result).toBe(false);
      });

      it('should return false if UserType is not a valid UserType.', () => {
        const userType = 'admin';

        const result = is<UserType>(userType);

        expect(result).toBe(false);
      });

      it('should return true if UserType is a valid UserType.', () => {
        const userTypes = Object.values(UserType);
        const userType = userTypes[Math.floor(Math.random() * userTypes.length)];

        const result = is<UserType>(userType);

        expect(result).toBe(true);
      });
    });
  });

  describe('User Signup', () => {
    const signupForm = {
      email: 'test2@delivery.com',
      name: 'Test Kim',
      password: 'qwe1234',
    };

    describe('Check user duplication', () => {
      it('should return a User if user exists.', async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(testUser);
        const where = { email: testUser.email };

        const result = await service.findUserByEmail(where);

        expect(result).toEqual(testUser);
      });

      it('should return null if user does not exist.', async () => {
        mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        const where = { email: signupForm.email };

        const result = await service.findUserByEmail(where);

        expect(result).toBe(null);
      });
    });

    describe('Save user to database', () => {
      it('should throw Error if create fails.', async () => {
        const data = {
          ...signupForm,
          email: testUser.email,
          type: UserType.CUSTOMER,
        };
        mockPrisma.user.create.mockRejectedValueOnce(new Error());

        await expect(service.createUser(data)).rejects.toThrow();
      });

      it('should return User if create succeeds.', async () => {
        const data = {
          ...signupForm,
          type: UserType.CUSTOMER,
        };
        const newUser = {
          ...data,
          userId: 2,
        };
        mockPrisma.user.create.mockResolvedValueOnce(newUser);

        const result = await service.createUser(data);

        expect(result.userId).toBe(2);
        expect(is<User>(result)).toBe(true);
      });
    });
  });

  describe('User Signin', () => {});
});
