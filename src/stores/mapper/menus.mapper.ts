import { Menu } from '@prisma/client';
import { MenuDto } from '../dto';

export function menuToDtoMap(menu: Menu): MenuDto {
  return {
    menuId: menu.menuId,
    name: menu.name,
    sort: menu.sort,
    status: menu.status,
    price: menu.price,
    inventory: menu.inventory,
    description: menu.description !== null ? menu.description : '',
    registrationDate: menu.registrationDate,
    storeId: menu.storeId,
  };
}