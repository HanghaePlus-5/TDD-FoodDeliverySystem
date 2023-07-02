import { StoreDto } from './store.dto';

export interface StoreUpdateDto extends Pick<StoreDto, 'storeId'> {
  name?: string;
  type?: StoreType;
  phoneNumber?: string;
  postalNumber?: string;
  address?: string;
  openingTime?: number;
  closingTime?: number;
  cookingTime?: number;
  origin?: string;
  description?: string;
}
