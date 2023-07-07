export {};

declare global {
  type StoreType = 'KOREAN' | 'CHINESE' | 'JAPANESE' | 'WESTERN' | 'CAFE';
  type StoreStatus = 'REGISTERED' | 'OPEN' | 'CLOSED' | 'TERMINATED' | 'OUT_OF_BUSINESS';
  type MenuStatus = 'REGISTERED' | 'OPEN' | 'CLOSED' | 'DELETED';
  type ViewType = 'OWNER' | 'CUSTOMER';
}
