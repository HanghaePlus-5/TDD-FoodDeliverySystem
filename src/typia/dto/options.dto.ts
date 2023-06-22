const UserType = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
type UserType = typeof UserType[keyof typeof UserType];

export interface OptionsDto {
  type: UserType;
  isNew: boolean;
}