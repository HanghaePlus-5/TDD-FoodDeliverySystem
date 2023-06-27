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

    const storeDto = new Object() as StoreDto;
    return storeDto;
  }

  async findOne(dto: any): Promise<StoreDto | null> {
    const storeDto = new Object() as StoreDto;
    return storeDto;
  }
}
