import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { MenuDto, MenuUpdateDto } from '../dto';
import { MenuCreateDto } from '../dto/menu-create.dto';
import { menuToDtoMap } from '../mapper/menus.mapper';

@Injectable()
export class MenusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: MenuCreateDto): Promise<MenuDto> {
    const { storeId } = dto;
    const maxSortMenu = await this.prisma.menu.findFirst({
      where: {
        storeId,
      },
      orderBy: {
        sort: 'desc',
      },
    });

    const nextSort = maxSortMenu ? maxSortMenu.sort! + 1 : 1;

    const menu = await this.prisma.menu.create({
      data: {
        ...dto,
        sort: nextSort,
      },
    });

    return menuToDtoMap(menu);
  }

  async update(dto: MenuUpdateDto): Promise<MenuDto> {
    const { menuId, ...rest } = dto;
    const menu = await this.prisma.menu.update({
      where: {
        menuId,
      },
      data: {
        ...rest,
      },
    });

    return menuToDtoMap(menu);
  }

  async findOne(dto: Partial<MenuDto>, statusValues: MenuStatus[] = []): Promise<MenuDto | null> {
    const menu = await this.prisma.menu.findFirst({
      where: {
        ...dto,
        status: statusValues.length > 0 ? { in: statusValues } : undefined,
      },
    });

    if (!menu) {
      return null;
    }
    return menuToDtoMap(menu);
  }
}
