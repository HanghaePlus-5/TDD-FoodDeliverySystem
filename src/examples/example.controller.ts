import {
  BadRequestException, Body, Controller, Get, InternalServerErrorException, Post,
} from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { FormDto, OptionsDto } from './dto';
import { EnvService } from '../config/env';

interface Response {
  age: number;
  options: OptionsDto;
}

@Controller('typia')
export class ExampleController {
  constructor(
    private readonly env: EnvService,
  ) {}

  @TypedRoute.Post('/example/1')
  async useNestia(
    @TypedBody() form: FormDto,
  ): Promise<Response> {
    console.log('useNestia form: ', form);

    return {
      age: form.age,
      options: form.options,
    };
  }

  @Post('/example/2')
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

  @Get('/example/3')
  envExample() {
    const database = this.env.get<string>('DATABASE_URL');
    return database;
  }
}
