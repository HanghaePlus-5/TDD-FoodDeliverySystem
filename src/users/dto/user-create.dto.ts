import { UserDto } from './user.dto';

export interface UserCreateDto extends Pick<UserDto, 'email'|'name'|'password'> {}

export interface UserCreateQueryDto {
  type: UserType;
}