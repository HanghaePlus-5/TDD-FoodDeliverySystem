import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';

import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';
import { StoreCreateDto, StoreDto } from '../dto';

describe('StoresRepository', () => {
  let repository: StoresRepository;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  const sampleCreateStoreDto: StoreCreateDto = {
    name: '커피커피',
    type: 'CAFE',
    businessNumber: '783-86-01715',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
  };

  const sampleStoreDto: StoreDto = {
    storeId: 1,
    name: '커피커피',
    type: 'CAFE',
    status: 'REGISTERED',
    businessNumber: '783-86-01715',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    reviewNumber: 0,
    averageScore: 0,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
    registrationDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StoresService, StoresRepository, EnvService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();
    repository = module.get<StoresRepository>(StoresRepository);
    mockPrisma = module.get(PrismaService);

    await mockPrisma.$connect();
  });

  afterEach(async () => {
    await mockPrisma.$disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if store name already exists', async () => {
      const mockfindOne = jest.spyOn(repository, 'findOne');
      mockfindOne.mockResolvedValue(sampleStoreDto);

      await expect(
        repository.create(sampleCreateStoreDto)
      ).rejects.toThrowError('already exists');
    });

    it('should create a store', async () => {
      const createdStore = await repository.create(sampleCreateStoreDto);
      const savedStore = await repository.findOne(sampleStoreDto);

      expect(createdStore).toEqual(savedStore);
    });
  });

  describe('findOne', () => {
    it('should return null if there is no store', async () => {
      const store = await repository.findOne({ name: 'NO_STORE!' });

      expect(store).toEqual(null);
    });

    it('should return a store if there is a store', async () => {
      const createdStore = await repository.create(sampleCreateStoreDto);
      const store = await repository.findOne({ name: createdStore.name });

      expect(store).toEqual(createdStore);
    });
  });
});
