import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

import { PrismaService } from 'src/prisma';
import { StoresRepository } from 'src/stores/stores/stores.repository';

import { createSampleStoreDto } from '../testUtils';

describe('StoresRepository', () => {
  let repository: StoresRepository;
  let Prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        StoresRepository,
        PrismaService,
        AsyncLocalStorage,
      ],
    }).compile();
    repository = module.get<StoresRepository>(StoresRepository);
    Prisma = module.get(PrismaService);

    await Prisma.$connect();
  });

  // afterEach(async () => {
  //   const deleteStore = Prisma.store.deleteMany({});
  //   await Prisma.$transaction([deleteStore]);
  //   await Prisma.$disconnect();
  // });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // describe('create', () => {
  //   it('should throw an error if store name already exists', async () => {
  //     const sampleCreateStoreDto = createSampleStoreDto();
  //     await repository.create(1, sampleCreateStoreDto);

  //     await expect(
  //       repository.create(1, sampleCreateStoreDto),
  //     ).rejects.toThrowError('already exists');
  //   });

  //   it('should create a store', async () => {
  //     const sampleCreateStoreDto = createSampleStoreDto();
  //     const createdStore = await repository.create(1, sampleCreateStoreDto);
  //     const savedStore = await repository.findOne({ name: createdStore.name }, 'OWNER' as ViewType);

  //     expect(createdStore).toEqual(savedStore);
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return null if there is no store', async () => {
  //     const store = await repository.findOne({ name: 'NO_STORE!' }, 'CUSTOMER' as ViewType);

  //     expect(store).toEqual(null);
  //   });

  //   it('should return a store if there is a store', async () => {
  //     const sampleCreateStoreDto = createSampleStoreDto();
  //     const createdStore = await repository.create(1, sampleCreateStoreDto);
  //     const store = await repository.findOne({ name: createdStore.name }, 'CUSTOMER' as ViewType);

  //     expect(store).toEqual(createdStore);
  //   });
  // });
});
