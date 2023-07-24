declare global {
  type StoreType = typeof StoreType[keyof typeof StoreType];
  type StoreStatus = typeof StoreStatus[keyof typeof StoreStatus];
  type MenuStatus = typeof MenuStatus[keyof typeof MenuStatus];
  type ViewType = typeof ViewType[keyof typeof ViewType];
}

export const StoreType = {
  KOREAN: 'KOREAN',
  CHINESE: 'CHINESE',
  JAPANESE: 'JAPANESE',
  WESTERN: 'WESTERN',
  CAFE: 'CAFE',
} as const;

export const StoreStatus = {
  REGISTERED: 'REGISTERED',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  TERMINATED: 'TERMINATED',
  OUT_OF_BUSINESS: 'OUT_OF_BUSINESS',
} as const;

export const MenuStatus = {
  REGISTERED: 'REGISTERED',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  DELETED: 'DELETED',
} as const;

export const ViewType = {
  OWNER: 'OWNER',
  CUSTOMER: 'CUSTOMER',
} as const;