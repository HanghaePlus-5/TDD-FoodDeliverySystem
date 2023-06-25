import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserType } from 'src/types';

describe('UsersController', () => {
  let controller: UsersController;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  const testUser = {
    userId: 1,
    email: 'test1@delivery.com',
    name: 'Test Kim',
    password: 'qwe1234',
    type: UserType.CUSTOMER,
  }

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

  beforeAll(() => {
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupForm = {
      email: 'test1@delivery.com',
      name: 'Test Kim',
      password: 'qwe1234',
    }
    const userTypes = Object.values(UserType);

    it('should throw Error if invalid user type.', async () => {
      const result = controller.signup(signupForm, { type: 'invalid' });
      await expect(result).rejects.toThrowError();
    });

    it('should throw Error if undefined user type.', async () => {
      const result = controller.signup(signupForm, { type: undefined });
      await expect(result).rejects.toThrowError();
    });
    
    it('should throw Error if duplicated user.', async () => {
      const type = userTypes[Math.random() * userTypes.length | 0];
      mockPrisma.user.findUnique.mockResolvedValueOnce(testUser);

      const result = controller.signup(signupForm, { type });

      await expect(result).rejects.toThrowError();
    });

    it('should throw Error if create fails.', async () => {
      const type = userTypes[Math.random() * userTypes.length | 0];
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockRejectedValueOnce(new Error());

      const result = controller.signup(signupForm, { type });

      await expect(result).rejects.toThrowError();
    });

    it.todo('should return User if create success.');
  });
});
