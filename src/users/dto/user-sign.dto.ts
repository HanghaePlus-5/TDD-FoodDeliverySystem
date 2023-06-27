import { UserDto } from './user.dto';

export interface UserSignDto extends Pick<UserDto, 'email'|'password'> {}