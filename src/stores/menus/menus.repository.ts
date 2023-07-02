import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { MenuCreateDto } from '../dto/menu-create.dto';
import { menuToDtoMap } from '../mapper/menus.mapper';
import { MenuDto } from '../dto';

@Injectable()
export class MenusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(dto: MenuCreateDto) {}

  async findOne(dto: Partial<MenuCreateDto>): Promise<MenuDto | null> {
    const munu = await this.prisma.menu.findFirst({ where: dto });
    return menuToDtoMap(munu);
  }
}
