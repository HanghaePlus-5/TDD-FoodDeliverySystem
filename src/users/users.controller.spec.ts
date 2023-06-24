import { Test, TestingModule } from '@nestjs/testing';
import { is } from 'typia';
import { PrismaService } from 'src/prisma';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './dto';
import { UserType } from 'src/types';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        PrismaService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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

    it('should throw Error if invalid user type.', async () => {
      const result = controller.signup(signupForm, { type: 'invalid' });
      await expect(result).rejects.toThrowError();
    });

    it('should throw Error if undefined user type.', async () => {
      const result = controller.signup(signupForm, { type: undefined });
      await expect(result).rejects.toThrowError();
    });
    
    it.todo('should throw Error if duplicated user.');
    it.todo('should throw Error if create fails.');
    it.todo('should return User if create success.');
  });
});
