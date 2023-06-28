import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeGuard } from './user-type.guard';
import { UserType } from 'src/types';

describe('AuthGuard', () => {
  let guard: UserTypeGuard;

  const testUserPayload: UserPayload = {
    userId: 1,
    name: 'Test Kim',
    type: UserType.CUSTOMER,
  };

  const createContext = (users: UserPayload) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        users: {},
      })),
      getResponse: jest.fn(),
    })),
  } as any) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserTypeGuard
      ],
    }).compile();

    guard = module.get<UserTypeGuard>(UserTypeGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('check UserPayload.', () => {
    it.todo('should throw Error if Request.user is empty.');

    it.todo('should throw Error if invalid UserPayload.');

    it.todo('should return true if valid UserPayload.');
  });

  describe('check UserType.', () => {
    it.todo('should throw Error if invalid UserType.');

    it.todo('should return true if valid UserType.');
  });
});
