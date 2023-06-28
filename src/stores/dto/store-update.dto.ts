import { StoreDto } from './store.dto';

export type StoreUpdateDto = Pick<StoreDto, 'storeId' > &
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
