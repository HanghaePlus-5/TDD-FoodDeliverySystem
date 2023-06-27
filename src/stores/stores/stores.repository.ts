import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { StoreCreateDto, StoreDto } from '../dto';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: StoreCreateDto) {
    const isDuplication = await this.findOne({
      name: dto.name,
      businessNumber: dto.businessNumber,
    });
    if (isDuplication) {
      throw new Error('already exists');
    }
  }

  async findOne(dto: any): Promise<StoreDto> {
    const storeDto = new Object() as StoreDto;
    return storeDto;
  }
}
