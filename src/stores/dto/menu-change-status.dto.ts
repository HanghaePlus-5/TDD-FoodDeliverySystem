import { MenuDto } from './menu.dto';

export interface MenuChangeStatusDto extends Pick<
    MenuDto,
    'storeId' | 'menuId' | 'status'
  > {}