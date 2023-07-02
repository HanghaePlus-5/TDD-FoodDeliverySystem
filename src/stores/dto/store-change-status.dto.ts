import { StoreDto } from './store.dto';

export interface StoreChangeStatusDto extends Pick<
    StoreDto,
    'storeId' | 'status'
  > {}
