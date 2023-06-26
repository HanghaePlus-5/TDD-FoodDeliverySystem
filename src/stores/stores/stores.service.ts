import { Injectable } from '@nestjs/common';

import { EnvService } from 'src/config/env.service';

import { StoreCreateDto, StoreDuplicationDto } from '../dto';

@Injectable()
export class StoresService {
  private readonly MIN_COOKING_TIME = this.env.get<number>('MIN_COOKING_TIME');
  private readonly MAX_COOKING_TIME = this.env.get<number>('MAX_COOKING_TIME');

  constructor(private readonly env: EnvService) {}

  async createStore(userId: number, dto: StoreCreateDto): Promise<boolean> {
    const isValidation = await this.checkValidation(dto);
    if (!isValidation) {
      return false;
    }
    return true;
  }

  public async checkValidationCaller(dto: StoreCreateDto): Promise<boolean> {
    return await this.checkValidation(dto);
  }

  private async checkValidation(dto: StoreCreateDto): Promise<boolean> {
    if (
      !dto.name
      || !dto.businessNumber
      || !dto.phoneNumber
      || !dto.postalNumber
      || !dto.address
      || !dto.openingTime
      || !dto.closingTime
      || !dto.cookingTime
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
    ) {
      return false;
    }

    return true;
  }

  private async checkBuninessNumber(BusinessNumber: string): Promise<boolean> {
    return true;
  }

  private async checkDuplication(dto: StoreDuplicationDto): Promise<boolean> {
    return true;
  }
}
