import { BadRequestException, Controller, InternalServerErrorException } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { createResponse } from 'src/utils/createResponse';

import { UserCreateDto, UserCreateQueryDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() form: UserCreateDto,
    @TypedQuery() query: UserCreateQueryDto,
  ) {
    const userType = query.type.toUpperCase();
    if (!is<UserType>(userType)) {
      throw new BadRequestException();
    }

    const user = await this.usersService.findUserByEmail({ email: form.email });
    if (is<User>(user)) {
      throw new BadRequestException();
    }

    const createdUser = await this.usersService.createUser({
      ...form,
      type: userType,
    });
    if (!is<User>(createdUser)) {
      throw new InternalServerErrorException();
    }

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
