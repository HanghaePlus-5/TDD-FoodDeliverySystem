import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { EnvService } from 'src/config/env';

import { StoresRepository } from './stores.repository';
import { StoreCreateDto, StoreDuplicationDto } from '../dto';

@Injectable()
export class StoresService {
  private readonly MIN_COOKING_TIME = this.env.get<number>('MIN_COOKING_TIME');
  private readonly MAX_COOKING_TIME = this.env.get<number>('MAX_COOKING_TIME');

  constructor(
    private readonly env: EnvService,
    private readonly storesRepository: StoresRepository,
  ) {}

  async createStore(userId: number, dto: StoreCreateDto): Promise<boolean> {
    const isValidation = await this.checkValidation(dto);
    if (!isValidation) {
      return false;
    }

    const isBusinessNumber = await this.checkBusinessNumber(dto.businessNumber);
    if (!isBusinessNumber) {
      return false;
    }

    await this.storesRepository.create(dto);

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

  public async checkBusinessNumberCaller(
    BusinessNumber: string,
  ): Promise<boolean> {
    return await this.checkBusinessNumber(BusinessNumber);
  }

  private async checkBusinessNumber(BusinessNumber: string): Promise<boolean> {
    const modifiedBusinessNumber = BusinessNumber.replace(/-/g, '');
    const data = {
      b_no: [`${modifiedBusinessNumber}`],
    };

    try {
      const BUSINESS_NUMBER_CHECK_API_KEY = this.env.get<string>(
        'BUSINESS_NUMBER_CHECK_API_KEY',
      );
      const response = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${BUSINESS_NUMBER_CHECK_API_KEY}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
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

  private async checkDuplication(dto: StoreDuplicationDto): Promise<boolean> {
    return true;
  }
}
