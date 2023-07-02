import { MenuDto, StoreDto } from '../dto';
import { MenuViewDto, StoreMenuDto } from '../dto/store-menu.dto';

export function StoreMenuDtoMap(store: StoreDto, menu: MenuDto): StoreMenuDto {
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
    origin: store.origin,
    description: store.description,
    Menus: [MenuDtoToViewDtoMap(menu)],
  };
}

export function MenuDtoToViewDtoMap(menu: MenuDto): MenuViewDto {
  return {
    menuId: menu.menuId,
    name: menu.name,
    sort: menu.sort,
    status: menu.status,
    price: menu.price,
    inventory: menu.inventory,
    description: menu.description,
  };
}
