import { StoreCreateDto, StoreDto } from 'src/stores/dto';
import { MenuCreateDto } from 'src/stores/dto/menu-create.dto';
import { StoreUpdateDto } from 'src/stores/dto/store-update.dto';

export function createSampleCreateStoreDto(dto: Partial<StoreCreateDto>): StoreCreateDto {
  return {
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
    userId: 1,
    ...dto,
  };
}

export function createSampleUpdateStoreDto(dto: Partial<StoreUpdateDto>): StoreUpdateDto {
  return {
    storeId: 1,
    name: '커피커피',
    type: 'CAFE',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
    ...dto,
  }
}

export function createSampleStoreDto(dto: Partial<StoreDto>): StoreDto {
  return {
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
    userId: 1,
    ...dto,
  };
}

export function createSampleCreateMenuDto(dto: Partial<MenuCreateDto>): MenuCreateDto{
  return {
    name: '아메리카노',
    sort: 1,
    price: 4000,
    description: '커피의 정석',
    ...dto,
  };
}