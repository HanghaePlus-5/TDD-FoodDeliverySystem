import { StoreDto } from './store.dto';

export type StoreCreateDto = Omit<
    StoreDto,
    'storeId' | 'status' | 'reviewNumber' | 'averageScore' | 'registrationDate'
  >
