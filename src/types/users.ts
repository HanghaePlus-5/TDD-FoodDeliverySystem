export const UserType = {
  CUSTOMER: 'CUSTOMER',
  BUSINESS: 'BUSINESS',
} as const;

declare global {
  type UserType = typeof UserType[keyof typeof UserType];

  interface User {
    userId: number;
    email: string;
    name: string;
    password: string;
    type: UserType;
  }

  interface UserPayload {
    userId: number;
    name: string;
    type: UserType;
  }

  namespace Express {
    interface Request {
      payload: UserPayload;
    }
  }
}
