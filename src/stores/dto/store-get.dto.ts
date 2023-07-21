import { StoreDto } from './store.dto';

export interface StoreGetDto extends Pick<StoreDto, 'storeId'> {
  viewType: ViewType;
}
