import { Injectable } from '@nestjs/common';
import { StoreStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma';

import { StoreCreateDto, StoreDto, StoreOptionalDto } from '../dto';
import { storeToDtoMap } from '../mapper/stores.mapper';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: StoreCreateDto): Promise<StoreDto> {
    const isDuplication = await this.findOne({
      name: dto.name,
      businessNumber: dto.businessNumber,
    });
    if (isDuplication) {
      throw new Error('already exists');
    }

    const storeDto = await this.prisma.store.create({
      data: {
        ...dto,
        status: StoreStatus.REGISTERED,
      },
    });
    return storeToDtoMap(storeDto);
  }

  async findOne(dto: StoreOptionalDto): Promise<StoreDto | null> {
    const storeDto = await this.prisma.store.findFirst({
      where: {
        ...dto,
      },
    });
    if (!storeDto) {
      return null;
    }
    return storeToDtoMap(storeDto);
  }
}
