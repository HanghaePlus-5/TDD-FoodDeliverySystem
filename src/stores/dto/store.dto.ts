export interface StoreDto {
  storeId: number;
  name: string;
  type: StoreType;
  status: StoreStatus;
  businessNumber: string;
  phoneNumber: string;
  postalNumber: string;
  address: string;
  openingTime: number;
  closingTime: number;
  cookingTime: number;
  reviewNumber: number;
  averageScore: number;
  origin: string;
  description: string;
  registrationDate: Date;
}
