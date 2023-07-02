import { MenuDto } from './menu.dto';
import { StoreDto } from './store.dto';

export type StoreMenuDto = Omit<StoreDto, 'registrationDate' | 'userId'> & {
  Menus: MenuViewDto[];
}
export type MenuViewDto = Omit<MenuDto, 'registrationDate' | 'storeId'>
