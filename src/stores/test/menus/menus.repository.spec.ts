import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { PrismaService } from 'src/prisma';
import { MenusRepository } from 'src/stores/menus/menus.repository';

describe('MenusRepository', () => {
  let repository: MenusRepository;
  let Prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [MenusRepository, PrismaService],
    }).compile();
    repository = module.get<MenusRepository>(MenusRepository);
    Prisma = module.get(PrismaService);

    await Prisma.$connect();
  });

  afterEach(async () => {
    const deleteMenu = Prisma.menu.deleteMany();
    await Prisma.$transaction([deleteMenu]);
    await Prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
