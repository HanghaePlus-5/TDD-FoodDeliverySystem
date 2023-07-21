import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { is } from 'typia';

import { ACTIVATE_STORE_STATUES } from 'src/constants/stores';

import { StoresRepository } from './stores.repository';
import {
  StoreCreateDto,
  StoreDto,
  StoreOptionalDto,
  StoreOwnedDto,
} from '../dto';
import { StoreChangeStatusDto } from '../dto/store-change-status.dto';
import { StoreMenuDto } from '../dto/store-menu.dto';
import { SearchDto } from '../dto/store-search.dto';
import { StoreUpdateDto } from '../dto/store-update.dto';
import { storeMenuDtoMap } from '../mapper/store-menu.mapper';
import { MenusService } from '../menus/menus.service';

@Injectable()
export class StoresService {
  private MIN_COOKING_TIME;
  private MAX_COOKING_TIME;

  constructor(
    private readonly configService: ConfigService,
    private readonly storesRepository: StoresRepository,
    private readonly menusService: MenusService,
  ) {
    this.MIN_COOKING_TIME = this.configService.get<number>('MIN_COOKING_TIME');
    this.MAX_COOKING_TIME = this.configService.get<number>('MAX_COOKING_TIME');
  }

  async createStore(user: UserPayload, dto: StoreCreateDto): Promise<StoreDto> {
    const storeOptionalDto = { ...dto, userId: user.userId };
    const isValidation = await this.checkValidation(storeOptionalDto);
    if (!isValidation) {
      throw new Error('Validation failed.');
    }

    const isBusinessNumber = await this.checkBusinessNumber(dto.businessNumber);
    if (!isBusinessNumber) {
      throw new Error('Invalid business number.');
    }

    try {
      const store = await this.storesRepository.create(user.userId, dto);
      return store;
    } catch (error) {
      throw new Error('Store creation failed.');
    }
  }

  async updateStore(user: UserPayload, dto: StoreUpdateDto): Promise<StoreDto> {
    const storeOwnedDto: StoreOwnedDto = { storeId: dto.storeId, userId: user.userId };
    const isStore = await this.checkStoreOwned(storeOwnedDto);
    if (!isStore) {
      throw new Error('Store not owned.');
    }
    const isStoreStatusGroup = await this.checkStoreStatusGroup(
      isStore.status,
      ACTIVATE_STORE_STATUES,
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }

    const storeOptionalDto: StoreOptionalDto = { ...isStore, ...dto };
    const isValidation = await this.checkValidation(storeOptionalDto);
    if (!isValidation) {
      throw new Error('Validation failed.');
    }

    const result = await this.storesRepository.update(storeOptionalDto);
    return result;
  }

  async changeStoreStatus(user: UserPayload, dto: StoreChangeStatusDto): Promise<StoreDto> {
    const storeOwnedDto: StoreOwnedDto = { storeId: dto.storeId, userId: user.userId };
    const isStore = await this.checkStoreOwned(storeOwnedDto);
    if (!isStore) {
      throw new Error('Store not owned.');
    }
    const isStoreStatusGroup = await this.checkStoreStatusGroup(
      isStore.status,
      ACTIVATE_STORE_STATUES,
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }

    const isStoreStatusChangeCondition = await this.checkStoreStatusChangeCondition(isStore.status, dto.status);
    if (!isStoreStatusChangeCondition) {
      throw new Error('Store status change condition not met.');
    }

    const result = await this.storesRepository.update(dto);
    return result;
  }

  async getStoresByBusinessUser(user: UserPayload): Promise<StoreDto[]> {
    const result = await this.storesRepository.findAllByUserId(user.userId);
    return result;
  }

  async getStoreByStoreId(storeId: number, viewType: ViewType, user?: UserPayload): Promise<StoreMenuDto> {
    if (viewType === 'OWNER') {
      if (!user) {
        throw new Error('UserId is required at OWNER ViewType.');
      }
    }

    const store = await this.storesRepository.findOne({ storeId, userId: user?.userId }, viewType);
    if (!store) {
      throw new Error('Store not found.');
    }
    const menu = await this.menusService.getMenus(storeId, viewType, user);
    const result = storeMenuDtoMap(store, menu);
    return result;
  }

  async getStoresBySearch(dto: SearchDto): Promise<StoreMenuDto[]> {
    const result = await this.storesRepository.findManyBySearch(dto);
    return result;
  }

  async checkStoreOwned(dto: StoreOwnedDto): Promise<StoreDto | null> {
    const result = await this.storesRepository.findOne(dto, 'OWNER');
    return result;
  }

  async checkStoreStatusGroup(
    status: StoreStatus,
    type: StoreStatus[],
  ): Promise<boolean> {
    return type.includes(status);
  }

  public async checkValidationCaller(dto: StoreOptionalDto): Promise<boolean> {
    const result = await this.checkValidation(dto);
    return result;
  }

  private async checkValidation(dto: StoreOptionalDto): Promise<boolean> {
    /* eslint-disable */
    if (!is<StoreOptionalDto>(dto)) {
      return false;
    }
      dto.cookingTime = Number(dto.cookingTime);

    if (
      dto.cookingTime < this.MIN_COOKING_TIME || dto.cookingTime > this.MAX_COOKING_TIME
      ) {
      return false;
    }

    return true;
    /* eslint-disable */
  }

  async checkBusinessNumber(businessNumber: string): Promise<boolean> {
    const modifiedBusinessNumber = businessNumber.replace(/-/g, '');
    const data = {
    // eslint-disable-next-line
      b_no: [`${modifiedBusinessNumber}`],
    };

    try {
      const BUSINESS_NUMBER_CHECK_API_KEY = this.configService.get<string>(
        'BUSINESS_NUMBER_CHECK_API_KEY',
      );
      const response = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${BUSINESS_NUMBER_CHECK_API_KEY}`,
        data,
        {
          headers: {
            // eslint-disable-next-line
            'Content-Type': 'application/json',
            // eslint-disable-next-line
            Accept: 'application/json',
          },
        },
      );
      if (response.data.data[0].b_stt_cd !== '01') {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  checkStoreStatusChangeCondition(
    fromStatus: StoreStatus,
    toStatus: StoreStatus,
  ): boolean {
    if (fromStatus === ('REGISTERED' || 'CLOSED') && toStatus === 'OPEN') {
      return true;
    }
    if (fromStatus === 'OPEN' && toStatus === 'CLOSED') {
      return true;
    }
    if (
      fromStatus === ('REGISTERED' || 'OPEN' || 'CLOSED')
      && toStatus === ('TERMINATED' || 'OUT_OF_BUSINESS')
    ) {
      return true;
    }
    return false;
  }
}
