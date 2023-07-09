import { Controller, Request, UseGuards } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';

import { StoresService } from './stores.service';
import { StoreCreateDto, StoreDto } from '../dto';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
  ) {}

  @TypedRoute.Post('/')
  @UseGuards()
  async createStore(
    @Request() req: Express.Request,
    @TypedBody() form: StoreCreateDto,
  ): Promise<StoreDto> {
    const store = await this.storesService.createStore(req.payload.userId, form);

    return store;
  }
}
