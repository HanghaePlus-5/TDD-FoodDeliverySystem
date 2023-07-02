import { Menu, Store } from '@prisma/client';

import { MenuViewDto, StoreMenuDto } from '../dto/store-menu.dto';

export function StoreMenuDtoMap(store: (Store & {menu: Menu[];})): StoreMenuDto {
  return {
    storeId: store.storeId,
    name: store.name,
    type: store.type,
    status: store.status,
    businessNumber: store.businessNumber,
    phoneNumber: store.phoneNumber,
    postalNumber: store.postalNumber,
    address: store.address,
    openingTime: store.openingTime,
    closingTime: store.closingTime,
    cookingTime: store.cookingTime,
    reviewNumber: store.reviewNumber,
    averageScore: store.averageScore,
    origin: store.origin ? store.origin : '',
    description: store.description ? store.description : '',
    Menus: store.menu.map(MenuToViewDtoMap),
  };
}

export function MenuToViewDtoMap(menu: Menu): MenuViewDto {
  return {
    menuId: menu.menuId,
    name: menu.name,
    sort: menu.sort,
    status: menu.status,
    price: menu.price,
    inventory: menu.inventory,
    description: menu.description ? menu.description : '',
  };
}
