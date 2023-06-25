export interface MenuDto {
  menuId: number;
  name: string;
  sort: number;
  status: MenuStatus;
  price: string[];
  description: string;
  registrationDate: Date;
}
