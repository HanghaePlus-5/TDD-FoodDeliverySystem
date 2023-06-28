import { StoreDto } from './store.dto';

export type StoreChangeStatusDto = Pick<StoreDto, 'storeId' | 'status'>;