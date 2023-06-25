import { StoreDto } from './store.dto';

export interface StoreCreateDto
  extends Omit<
    StoreDto,
    'idx' | 'status' | 'reviewNumber' | 'averageScore' | 'registrationDate'
  > {}
