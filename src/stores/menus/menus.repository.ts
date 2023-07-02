import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { MenuDto } from '../dto';
import { MenuCreateDto } from '../dto/menu-create.dto';
import { menuToDtoMap } from '../mapper/menus.mapper';

@Injectable()
export class MenusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: MenuCreateDto) {
    const menu = await this.prisma.menu.create({
      data: {
        ...dto,
      },
    });
    return menuToDtoMap(menu);
  }

  async findOne(dto: Partial<MenuCreateDto>, statusValues: MenuStatus[] = []): Promise<MenuDto | null> {
    const munu = await this.prisma.menu.findFirst({
      where: {
        ...dto,
        status: statusValues.length > 0 ? { in: statusValues } : undefined,
      },
});
    return menuToDtoMap(munu);
  }
}
