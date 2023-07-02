import { StoreDto } from './store.dto';

export interface StoreCreateDto extends Omit<
    StoreDto,
    'storeId' | 'status' | 'reviewNumber' | 'averageScore' | 'registrationDate'
  > {}
