import { MenuDto } from './menu.dto';

export type MenuCreateDto = Omit<
  MenuDto,
  'menuId' | 'status' | 'registrationDate' | 'storeId'
>
