export const UserType = {
  CUSTOMER: 'CUSTOMER',
  BUSINESS: 'BUSINESS',
} as const;

declare global {
  type UserType = typeof UserType[keyof typeof UserType];
}