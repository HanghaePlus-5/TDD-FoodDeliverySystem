import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class StoresService {
  constructor(private readonly usersService: UsersService) {}
  async createStore(userId: number, dto: any) {
    // const user = await this.usersService.getUser(userId);
    const isValidation = this.checkValidation(dto);
    if (!isValidation) {
      throw new Error('Validation Error');
    }
  }

  async checkValidation(dto: any): Promise<boolean> {
    return false;
  }
}
