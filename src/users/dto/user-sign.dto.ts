import { UserDto } from './user.dto';

export type UserSignDto = Pick<UserDto, 'email'|'password'>
