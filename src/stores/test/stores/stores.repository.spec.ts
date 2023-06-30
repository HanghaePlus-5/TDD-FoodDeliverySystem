import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';

import { StoresService } from 'src/stores/stores/stores.service';
import { StoresRepository } from 'src/stores/stores/stores.repository';
import { StoreCreateDto, StoreDto } from 'src/stores/dto';
import { createSampleStoreDto } from '../utils/testUtils';

describe('StoresRepository', () => {
  let repository: StoresRepository;
  let Prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StoresService, StoresRepository, EnvService, PrismaService],
    }).compile();
    repository = module.get<StoresRepository>(StoresRepository);
    Prisma = module.get(PrismaService);

    await Prisma.$connect();
  });

  afterEach(async () => {
    const deleteStore = Prisma.store.deleteMany();
    await Prisma.$transaction([deleteStore]);
    await Prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if store name already exists', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleStoreDto({});
      await repository.create(sampleCreateStoreDto);

      await expect(
        repository.create(sampleCreateStoreDto),
      ).rejects.toThrowError('already exists');
    });

    it('should create a store', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleStoreDto({});
      const createdStore = await repository.create(sampleCreateStoreDto);
      const savedStore = await repository.findOne({ name: createdStore.name });

      expect(createdStore).toEqual(savedStore);
    });
  });

  describe('findOne', () => {
    it('should return null if there is no store', async () => {
      const store = await repository.findOne({ name: 'NO_STORE!' });

      expect(store).toEqual(null);
    });

    it('should return a store if there is a store', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleStoreDto({});
      const createdStore = await repository.create(sampleCreateStoreDto);
      const store = await repository.findOne({ name: createdStore.name });

      expect(store).toEqual(createdStore);
    });
  });
});
