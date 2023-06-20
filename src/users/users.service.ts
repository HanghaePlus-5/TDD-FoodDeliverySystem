import { Injectable } from '@nestjs/common';
import { UserType } from 'src/types';

@Injectable()
export class UsersService {
  checkUserType(userType: string|undefined): boolean {
    return (
      userType !== undefined
      && ['customer', 'business'].includes(userType)
    );
  }
  isUserType(userType: string|undefined): userType is UserType {
    return Object.values(UserType).includes(userType as UserType);
  }
}