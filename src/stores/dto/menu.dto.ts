export interface MenuDto {
  menuId: number;
  name: string;
  sort: number;
  status: MenuStatus;
  price: number;
  description: string | null;
  registrationDate: Date;
  storeId: number;
}
