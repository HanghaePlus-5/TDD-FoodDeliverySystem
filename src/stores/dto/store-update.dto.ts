import { StoreDto } from './store.dto';

export type StoreUpdateDto = Pick<StoreDto, 'storeId' | 'userId'> &
  Partial<
    Pick<
      StoreDto,
      | 'name'
      | 'type'
      | 'phoneNumber'
      | 'postalNumber'
      | 'address'
      | 'openingTime'
      | 'closingTime'
      | 'cookingTime'
      | 'origin'
      | 'description'
    >
  >;
