import { BadRequestException, Controller, InternalServerErrorException } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { JwtAuthService } from 'src/auth/services';
import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { UserCreateDto } from './dto';
import { UserSignDto } from './dto/user-sign.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtAuthService,
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

  async signin(form: UserSignDto) {
    const user = await this.usersService.findUserByEmailAndPassword(form);
    if (!is<User>(user)) {
      throw new BadRequestException();
    }

    const accessToken = await this.jwt.createAccessToken(user);
    if (accessToken === null) {
      throw new InternalServerErrorException();
    }

    return true;
  }
}
