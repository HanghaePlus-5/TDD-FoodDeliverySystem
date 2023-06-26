import { UserDto } from './user.dto';

export type UserCreateDto = Pick<UserDto, 'email'|'name'|'password'>

export interface UserCreateQueryDto {
  type: UserType;
}
