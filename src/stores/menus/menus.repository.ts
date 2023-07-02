import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { MenuCreateDto } from '../dto/menu-create.dto';

@Injectable()
export class MenusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMenu(dto: MenuCreateDto) {}

  async findOne(dto: Partial<MenuCreateDto>) {
    return this.prisma.menu.findFirst({ where: dto });
  }
}
