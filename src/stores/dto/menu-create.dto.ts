import { MenuDto } from './menu.dto';

export interface MenuCreateDto extends Omit<
    MenuDto,
    'menuId' | 'sort' | 'status' | 'registrationDate'
  > {}
