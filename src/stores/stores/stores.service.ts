import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

  async createStore(userId: number, dto: StoreCreateDto): Promise<StoreDto> {
    const storeOptionalDto = { ...dto, userId };
    const isValidation = await this.checkValidation(storeOptionalDto);
    if (!isValidation) {
      throw new Error('Validation failed.');
    }

    const isBusinessNumber = await this.checkBusinessNumber(dto.businessNumber);
    if (!isBusinessNumber) {
      throw new Error('Invalid business number.');
    }

    try {
      const store = await this.storesRepository.create(1, dto);
      return store;
    } catch (error) {
      throw new Error('Store creation failed.');
    }
  }

  async updateStore(userId: number, dto: StoreUpdateDto): Promise<StoreDto> {
    const storeOwnedDto: StoreOwnedDto = { storeId: dto.storeId, userId };
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

  async changeStoreStatus(userId: number, dto: StoreChangeStatusDto): Promise<StoreDto> {
    const storeOwnedDto: StoreOwnedDto = { storeId: dto.storeId, userId };
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

  async getStoresByBusinessUser(userId: number): Promise<StoreDto[]> {
    const result = await this.storesRepository.findAllByUserId(userId);
    return result;
  }

  async getStoreByStoreId(storeId: number, viewType: ViewType, userId?: number): Promise<StoreMenuDto | null> {
    if (viewType === 'OWNER') {
      if (!userId) {
        throw new Error('UserId is required at OWNER ViewType.');
      }
    }

    const store = await this.storesRepository.findOne({ storeId, userId }, viewType);
    if (!store) {
      throw new Error('Store not found.');
    }
    const menu = await this.menusService.getMenus(storeId, viewType, userId);
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
    if (
      !dto.name
      || !dto.businessNumber
      || !dto.phoneNumber
      || !dto.postalNumber
      || !dto.address
      || !dto.openingTime
      || !dto.closingTime
      || !dto.cookingTime
      || !dto.userId
    ) {
      return false;
    }

    if (/[a-zA-Z!@#$%^&*(),.?":{}|<>]/.test(dto.name)) {
      return false;
    }

    if (
      dto.name.length === 0
      || dto.businessNumber.length !== 12
      || dto.phoneNumber.length < 11
      || dto.phoneNumber.length > 13
      || dto.postalNumber.length !== 5
      || dto.address.length === 0
      || dto.openingTime > 23
      || dto.openingTime < 0
      || dto.closingTime > 23
      || dto.closingTime < 0
      || dto.cookingTime < this.MIN_COOKING_TIME
      || dto.cookingTime > this.MAX_COOKING_TIME
      || dto.userId < 1
    ) {
      return false;
    }

    return true;
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
