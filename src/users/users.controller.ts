import { BadRequestException, Controller } from '@nestjs/common';
import { TypedRoute } from '@nestia/core';
import { is } from 'typia';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @TypedRoute.Post('/signup')
  async signup(form, query) {
    if (!is<UserType>(query.type)) {
      throw new BadRequestException();
    }
    return true;
  }
}
