import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypedRoute } from '@nestia/core';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @TypedRoute.Post('/signup')
  async signup(form, query) {
    return true;
  }
}
