import { MenuDto } from './menu.dto';

export type MenuCreateDto = Omit<
    MenuDto,
    'menuId' | 'sort' | 'status' | 'registrationDate'
  >
