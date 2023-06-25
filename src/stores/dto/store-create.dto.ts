import { StoreDto } from './store.dto';

export type StoreCreateDto = Omit<
    StoreDto,
    'idx' | 'status' | 'reviewNumber' | 'averageScore' | 'registrationDate'
  >
