import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserType } from 'src/types';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Signup', () => {
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

    describe('Check user duplication', () => {});

    describe('Encrypt user password', () => {});

    describe('Save user to database', () => {});
  });
});
