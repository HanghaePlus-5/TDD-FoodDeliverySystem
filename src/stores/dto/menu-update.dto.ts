import { MenuDto } from './menu.dto';

export interface MenuUpdateDto extends Pick<MenuDto, 'storeId' | 'menuId'> {
  name?: string;
  price?: number;
  description?: string;
}