import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';

import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';

describe('StoresRepository', () => {
  let Repository: StoresRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StoresService, StoresRepository, EnvService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();
    Repository = module.get<StoresRepository>(StoresRepository);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(Repository).toBeDefined();
  });
});
