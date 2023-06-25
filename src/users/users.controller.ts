import { BadRequestException, Controller, InternalServerErrorException } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { is } from 'typia';
import { UsersService } from './users.service';
import { UserCreateDto, UserCreateQueryDto } from './dto';
import { createResponse } from 'src/utils/createResponse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() form: UserCreateDto,
    @TypedQuery() query: UserCreateQueryDto,
  ) {
    if (!is<UserType>(query.type)) {
      throw new BadRequestException();
    }

    const user = await this.usersService.findUserByEmail({ email: form.email });
    if (is<User>(user)) {
      throw new BadRequestException();
    }

    const createdUser = await this.usersService.createUser({
      ...form,
      type: query.type,
    });
    if (!is<User>(createdUser)) {
      throw new InternalServerErrorException();
    }

    return createResponse<User>(createdUser);
  }
}
