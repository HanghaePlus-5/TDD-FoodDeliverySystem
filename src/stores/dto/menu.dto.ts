export interface MenuDto {
  menuId: number;
  name: string;
  sort: number | null;
  status: MenuStatus;
  price: number;
  inventory: number;
  description: string;
  registrationDate: Date;
  storeId: number;
}

export type MenuOptionalDto = Partial<MenuDto>
