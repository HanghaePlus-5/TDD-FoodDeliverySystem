import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserType } from 'src/types';
import { PrismaService } from 'src/prisma';

describe('UsersService', () => {
  let service: UsersService;

  interface Select {
    where: {
      email: string;
    };
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
      findUnique: jest.fn((select: Select) => {
        return select.where.email === testUser.email ? testUser : null;
      }),
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
      ],
    }).useMocker((token) => {
      if (token === PrismaService) {
        return mockPrismaService;
      }
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Signup', () => {
    const signupForm = {
      email: 'test1@delivery.com',
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
      it('should return a User if user exists.', () => {
        const result = service.findUserByEmail(testUser.email);
        expect(result).toEqual(testUser);
      });

      it.todo('should return null if user does not exist.');
    });

    describe('Encrypt user password', () => {});

    describe('Save user to database', () => {});
  });
});
