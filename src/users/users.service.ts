import { Injectable } from '@nestjs/common';
import { UserType } from 'src/types';

@Injectable()
export class UsersService {
  isUserType(userType: string|undefined): userType is UserType {
    return Object.values(UserType).includes(userType as UserType);
  }
}