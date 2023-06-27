import { Store } from '@prisma/client';

import { StoreDto } from '../dto';

export function storeToDtoMap(store: Store): StoreDto {
  return {
    storeId: store.storeId,
    name: store.name,
    type: store.type,
    status: store.status,
    businessNumber: store.businessNumber,
    phoneNumber: store.phoneNumber,
    postalNumber: store.postalNumber,
    address: store.address,
    openingTime: store.openingTime,
    closingTime: store.closingTime,
    cookingTime: store.cookingTime,
    reviewNumber: store.reviewNumber,
    averageScore: store.averageScore,
    origin: store.origin !== null ? store.origin : '',
    description: store.description !== null ? store.description : '',
    registrationDate: store.registrationDate,
  };
}
