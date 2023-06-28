import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserTypeGuard } from './user-type.guard';
import { UserType } from 'src/types';

describe('AuthGuard', () => {
  let guard: UserTypeGuard;
  let reflector: Reflector;

  const testUserPayload: UserPayload = {
    userId: 1,
    name: 'Test Kim',
    type: UserType.CUSTOMER,
  };

  const createContext = (user: UserPayload) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({ user })),
      getResponse: jest.fn(),
    })),
  } as any) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserTypeGuard,
        Reflector,
      ],
    }).compile();

    guard = module.get<UserTypeGuard>(UserTypeGuard);
    reflector = module.get<Reflector>(Reflector);

    reflector.get = jest.fn();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  describe('check UserPayload.', () => {
    it('should throw Error if Request.user is empty.', () => {
      const context: ExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(),
          getResponse: jest.fn(),
        })),
      } as any
      expect(() => guard.canActivate(context)).toThrowError();
    });

    it('should throw Error if invalid UserPayload.', () => {
      const invalidUserPayload = {
        userId: '1' as unknown,
        name: 'Test Kim',
        type: UserType.BUSINESS,
      }
      const context = createContext(invalidUserPayload as UserPayload);
      expect(() => guard.canActivate(context)).toThrowError();
    });

    it('should return true if valid UserPayload.', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserType.CUSTOMER]);
      const context = createContext(testUserPayload);
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('check UserType.', () => {
    it('should throw Error if invalid UserType.', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([UserType.BUSINESS]);
      const context = createContext(testUserPayload);
      expect(() => guard.canActivate(context)).toThrowError();
    });

    it.todo('should return true if valid UserType.');
  });
});
