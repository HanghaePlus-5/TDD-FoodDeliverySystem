import { MenuDto } from './menu.dto';
import { StoreDto } from './store.dto';

export interface StoreMenuDto extends Omit<StoreDto, 'registrationDate' | 'userId'> {
  menus: MenuViewDto[];
}

export type MenuViewDto = Omit<MenuDto, 'registrationDate' | 'storeId'>
