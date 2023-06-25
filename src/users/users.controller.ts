import { BadRequestException, Controller, InternalServerErrorException } from '@nestjs/common';
import { TypedRoute } from '@nestia/core';
import { is } from 'typia';
import { UsersService } from './users.service';
import { UserCreateDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @TypedRoute.Post('/signup')
  async signup(form: UserCreateDto, query) {
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

    return true;
  }
}
