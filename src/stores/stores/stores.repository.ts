import { Injectable } from '@nestjs/common';
import { Store, StoreStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma';

import { StoreCreateDto, StoreDto, StoreOptionalDto } from '../dto';
import { SearchDto } from '../dto/store-search.dto';
import { storeToDtoMap } from '../mapper/stores.mapper';
import { ACTIVATE_STORE_STATUES, OPENED_MENU_STATUES, OPENED_STORE_STATUES } from 'src/constants/stores';
import { StoreMenuSearchDtoMap } from '../mapper/store-menu.mapper';
import { StoreMenuDto } from '../dto/store-menu.dto';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: StoreCreateDto) {
    let store: Store;
    try {
      store = await this.prisma.store.create({
        data: {
          ...dto,
          userId,
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

  async update(dto: StoreOptionalDto): Promise<StoreDto> {
    const store = await this.prisma.store.update({
      where: {
        storeId: dto.storeId,
      },
      data: {
        ...dto,
      },
    });
    return storeToDtoMap(store);
  }

  async findOne(dto: StoreOptionalDto, viewType: ViewType): Promise<StoreDto | null> {
    const store = await this.prisma.store.findFirst({
      where: {
        status: viewType === 'OWNER' ? { in: ACTIVATE_STORE_STATUES } : { in: OPENED_STORE_STATUES },
        ...dto,
      },
    });
    if (!store) {
      return null;
    }
    return storeToDtoMap(store);
  }

  async findAllByUserId(userId: number): Promise<StoreDto[]> {
    const stores = await this.prisma.store.findMany({
      where: {
        userId,
      },
      orderBy: {
        storeId: 'asc',
      },
    });
    return stores.map(storeToDtoMap);
  }

  async findManyBySearch(dto: SearchDto): Promise<StoreMenuDto[]> {
    const { keyword, page, limit } = dto;
    const offset = (page - 1) * limit;
    const stores = await this.prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: keyword } },
          { address: { contains: keyword } },
          { origin: { contains: keyword } },
          { description: { contains: keyword } },
        ],
        status: {
          in: OPENED_STORE_STATUES,
        }
      },
      orderBy: {
        storeId: 'asc',
      },
      skip: offset,
      take: limit,
      include: {
        menu: {
          where: {
            status: {
              in: OPENED_MENU_STATUES,
            }
          },
          orderBy: {
            sort: 'asc',
          },
        },
      }
    });
    return stores.map(StoreMenuSearchDtoMap);
  }
}
