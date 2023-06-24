import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserType } from 'src/types';
import { PrismaService } from 'src/prisma';
import { UserDto } from './dto';

describe('UsersService', () => {
  let service: UsersService;

  interface Select {
    where: {
      email: string;
    };
  }

  interface Create {
    email: string;
    name: string;
    password: string;
    type: UserType;
  }

  const testUser = {
    userId: 1,
    email: 'test1@delivery.com',
    name: 'Test Kim',
    password: 'qwe1234',
    type: 'customer',
  }

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(async (select: Select) => {
        return select.where.email === testUser.email ? testUser : null;
      }),
      create: jest.fn(async (data: Create): Promise<UserDto> => {
        if (data.email === testUser.email) {
          throw new Error();
        }
        return {
          ...data,
          userId: 2,
        }
      }),
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Signup', () => {
    const signupForm = {
      email: 'test2@delivery.com',
      name: 'Test Kim',
      password: 'qwe1234',
    }

    describe('Check UserType', () => {
      it('should return false if UserType is undefined.', () => {
        const userType = undefined;
        const result = service.isUserType(userType);
        expect(result).toBe(false);
      });
  
      it('should return false if UserType is not a valid UserType.', () => {
        const userType = 'admin';
        const result = service.isUserType(userType);
        expect(result).toBe(false);
      });
  
      it('should return true if UserType is a valid UserType.', () => {
        const userTypes = Object.values(UserType);
        const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
        const result = service.isUserType(userType);
        expect(result).toBe(true);
      });
    });

    describe('Check user duplication', () => {
      it('should return a User if user exists.', async () => {
        const where = { email: testUser.email };
        const result = await service.findUserByEmail(where);
        expect(result).toEqual(testUser);
      });

      it('should return null if user does not exist.', async () => {
        const where = { email: signupForm.email };
        const result = await service.findUserByEmail(where);
        expect(result).toBe(null);
      });
    });

    describe('Save user to database', () => {
      it('should return Error if create fails.', () => {
        const form = {
          ...signupForm,
          email: testUser.email,
        };
        expect(service.createUser(form)).rejects.toThrow();
      });
      it.todo('should return User if create succeeds.');
    });
  });
});
