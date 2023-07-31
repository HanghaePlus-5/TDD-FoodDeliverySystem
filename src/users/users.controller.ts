import {
  Controller,
  Res,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { is } from 'typia';

import { IgnoreAuth } from 'src/auth/decorators';
import { JwtAuthService } from 'src/auth/services';
import { AsyncStore } from 'src/lib/als/als.middleware';
import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { UserCreateDto } from './dto';
import { UserSignDto } from './dto/user-sign.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtAuthService,
    private readonly als: AsyncLocalStorage<AsyncStore>,
  ) {}

  @IgnoreAuth()
  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() form: UserCreateDto,
  ): Promise<ResponseForm<User>> {
    const user = await this.usersService.findUserByEmail({ email: form.email });
    if (is<User>(user)) {
      throw new BadRequestException();
    }

    const createdUser = await this.usersService.createUser(form);
    if (!is<User>(createdUser)) {
      throw new InternalServerErrorException();
    }

    return createResponse<User>(createdUser);
  }

  @IgnoreAuth()
  @TypedRoute.Post('/signin')
  async signin(
    @TypedBody() form: UserSignDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseForm<User>> {
    const user = await this.usersService.findUserByEmailAndPassword(form);
    if (!is<User>(user)) {
      throw new BadRequestException();
    }

    const accessToken = await this.jwt.createAccessToken(user);
    if (accessToken === null) {
      throw new InternalServerErrorException();
    }

    res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 });

    return createResponse<User>(user);
  }

  @TypedRoute.Get('/me')
  async findMe() {
    const store = this.als.getStore();
    console.log('store: ', store);
    return this.usersService.findUserById({ userId: store?.user.userId });
  }

  @IgnoreAuth()
  @TypedRoute.Get('/cpu')
  async task() {
    return getPrimes((Math.random() * 500000) * 5);
  }
}

/* eslint-disable */
function getPrimes(max: number) {
  const start = Date.now();
  const primes: number[] = [];

  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }

  const end = Date.now();
  const time = `${Math.floor((end - start) / 1000)} sec`;

  return {
    count: primes.length,
    time,
  };
}
/* eslint-disable */