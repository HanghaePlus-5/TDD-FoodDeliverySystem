import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

import { PrismaModule, PrismaService } from 'src/prisma';
import { MenusRepository } from 'src/stores/menus/menus.repository';

describe('MenusRepository', () => {
  let repository: MenusRepository;
  let Prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
      ],
      providers: [
        MenusRepository,
        PrismaService,
        AsyncLocalStorage,
      ],
    }).compile();
    repository = module.get<MenusRepository>(MenusRepository);
    Prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
