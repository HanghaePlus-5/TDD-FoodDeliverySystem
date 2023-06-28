import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { IgnoreAuth, UserTypes } from 'src/auth/decorators';

import { FormDto, OptionsDto } from './dto';
import { EnvService } from '../config/env';

import { UserType } from 'src/types';

interface Response {
  age: number;
  options: OptionsDto;
}

@Controller('example')
export class ExampleController {
  constructor(
    private readonly env: EnvService,
  ) {}

  @TypedRoute.Post('/nestia')
  async useNestia(
    @TypedBody() form: FormDto,
  ): Promise<Response> {
    console.log('useNestia form: ', form);

    return {
      age: form.age,
      options: form.options,
    };
  }

  @Post('/typia')
  nouseNestia(
    @Body() form: FormDto,
  ) {
    if (!is<FormDto>(form)) {
      throw new BadRequestException('Invalid form');
    }

    const response = {
      age: form.age,
      options: form.options,
    };

    if (!is<Response>(response)) {
      throw new InternalServerErrorException('Invalid response');
    }

    return response;
  }

  @Get('/env')
  envExample() {
    const database = this.env.get<string>('DATABASE_URL');
    return database;
  }

  @IgnoreAuth()
  @Get('/auth')
  ignoreAuthExample() {
    return true;
  }

  @UserTypes(UserType.BUSINESS)
  @Get('/usertype')
  userTypeExample(
    @Req() req: Express.Request,
  ) {
    const user = req.user;
    return user;
  }
}
