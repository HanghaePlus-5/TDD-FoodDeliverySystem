import { Injectable } from '@nestjs/common';

import { StoreCreateDto } from '../dto';

@Injectable()
export class StoresService {
  private readonly MIN_COOKING_TIME: number = parseInt(
    process.env.MIN_COOKING_TIME || '5',
  );
  private readonly MAX_COOKING_TIME: number = parseInt(
    process.env.MAX_COOKING_TIME || '120',
  );
  async createStore(userId: number, dto: StoreCreateDto): Promise<boolean> {
    const isValidation = await this.checkValidation(dto);
    if (!isValidation) {
      return false;
    }
    return true;
  }

  async checkValidation(dto: StoreCreateDto): Promise<boolean> {
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
}
