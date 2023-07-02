export interface MenuDto {
  menuId: number;
  name: string;
  sort: number;
  status: MenuStatus;
  price: number;
  description: string;
  registrationDate: Date;
  storeId: number;
}

export interface MenuOptionalDto extends Partial<MenuDto> {}