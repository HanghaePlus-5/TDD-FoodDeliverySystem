import { BadRequestException, Controller } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { UserCreateDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() form: UserCreateDto,
  ): Promise<ResponseForm<User>> {
    const user = await this.usersService.findUserByEmail({ email: form.email });
    if (is<User>(user)) {
      throw new BadRequestException();
    }

    const createdUser = await this.usersService.createUser(form);

    return createResponse<User>(createdUser);
  }

  async signin(form) {
    const user = this.usersService.findUserByEmailAndPassword(form);
    if (!is<User>(user)) {
      throw new BadRequestException();
    }

    return true;
  }

}