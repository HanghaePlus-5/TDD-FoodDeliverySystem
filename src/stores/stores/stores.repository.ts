import { Injectable } from '@nestjs/common';
import { Store, StoreStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma';

import { StoreCreateDto, StoreDto, StoreOptionalDto } from '../dto';
import { storeToDtoMap } from '../mapper/stores.mapper';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: StoreCreateDto) {
    let store: Store;
    try {
      store = await this.prisma.store.create({
        data: {
          ...dto,
          status: StoreStatus.REGISTERED,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new Error('already exists');
      }
      console.log(e);
      throw new Error('create store error');
    }
    return storeToDtoMap(store);
  }

  async findOne(dto: StoreOptionalDto): Promise<StoreDto | null> {
    const store = await this.prisma.store.findFirst({
      where: {
        ...dto,
      },
    });
    if (!store) {
      return null;
    }
    return storeToDtoMap(store);
  }
}
