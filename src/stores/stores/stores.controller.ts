import {
 BadRequestException, Controller, Request, UseGuards,
} from '@nestjs/common';
import {
 TypedBody, TypedQuery, TypedRoute,
} from '@nestia/core';
import { is } from 'typia';

import { IgnoreAuth } from 'src/auth/decorators';
import { BearerAuthGuard } from 'src/auth/guards';
import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { StoresService } from './stores.service';
import {
  SearchDto,
 StoreChangeStatusDto, StoreCreateDto, StoreDto, StoreUpdateDto,
} from '../dto';
import { StoreMenuDto } from '../dto/store-menu.dto';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
  ) {}

  @TypedRoute.Post('/')
  @UseGuards(BearerAuthGuard)
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
  @UseGuards(BearerAuthGuard)
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
  @UseGuards(BearerAuthGuard)
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

  @TypedRoute.Get('/myBunsiness')
  @UseGuards(BearerAuthGuard)
  async getMyBusiness(
    @Request() req: Express.Request,
  ): Promise<ResponseForm<StoreDto[]>> {
    const stores = await this.storesService.getStoresByBusinessUser(req.payload);

    return createResponse<StoreDto[]>(stores);
  }

  // TODO : getStoreByStoreId -> when UserPayload is added at middleware

  @TypedRoute.Get('/search')
  @IgnoreAuth()
  async searchStores(
    @TypedQuery() searchDto: SearchDto,
  ): Promise<ResponseForm<StoreMenuDto[]>> {
    const stores = await this.storesService.getStoresBySearch(searchDto);

    return createResponse<StoreMenuDto[]>(stores);
  }
}
