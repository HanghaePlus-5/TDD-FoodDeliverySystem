export const UserType = {
  CUSTOMER: 'customer',
  BUSINESS: 'business',
} as const;

declare global {
  type UserType = typeof UserType[keyof typeof UserType];
}