import { MenuDto } from './menu.dto';

export interface MenuCreateDto extends Omit<
    MenuDto,
    'menuId' | 'status' | 'registrationDate'
  > {}
