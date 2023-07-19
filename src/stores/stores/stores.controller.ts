import { BadRequestException, Controller, Request, UseGuards } from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';

import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { StoresService } from './stores.service';
import { StoreChangeStatusDto, StoreCreateDto, StoreDto, StoreUpdateDto } from '../dto';
import { is } from 'typia';

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
  ): Promise<ResponseForm<StoreDto>> {
    if (!is<StoreCreateDto>(form)) {
      throw new BadRequestException();
    }

    const store = await this.storesService.createStore(req.payload, form);

    return createResponse<StoreDto>(store);
  }

  @TypedRoute.Patch('/')
  @UseGuards()
  async updateStore(
    @Request() req: Express.Request,
    @TypedBody() form: StoreUpdateDto,
  ): Promise<ResponseForm<StoreDto>> {
    if (!is<StoreUpdateDto>(form)) {
      throw new BadRequestException();
    }

    const store = await this.storesService.updateStore(req.payload, form);

    return createResponse<StoreDto>(store);
  }

  @TypedRoute.Post('/status')
  @UseGuards()
  async changeStoreStatus(
    @Request() req: Express.Request,
    @TypedBody() form: StoreChangeStatusDto,
  ): Promise<ResponseForm<StoreDto>> {
    if (!is<StoreChangeStatusDto>(form)) {
      throw new BadRequestException();
    }

    const store = await this.storesService.changeStoreStatus(req.payload, form);

    return createResponse<StoreDto>(store);
  }
}
