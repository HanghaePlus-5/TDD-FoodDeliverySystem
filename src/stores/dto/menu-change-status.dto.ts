import { MenuDto } from './menu.dto';

export type MenuChangeStatusDto = Pick<
    MenuDto,
    'storeId' | 'menuId' | 'status'
  >
