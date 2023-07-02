import { MenuDto } from '../dto';

export function menuToDtoMap(menu): MenuDto {
  return {
    menuId: menu.menuId,
    name: menu.name,
    sort: menu.sort,
    status: menu.status,
    price: menu.price,
    description: menu.description !== null ? menu.description : '',
    registrationDate: menu.registrationDate,
    storeId: menu.storeId,
  };
}