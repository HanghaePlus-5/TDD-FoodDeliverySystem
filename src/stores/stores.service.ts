import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StoreCreateDto } from './dto';

@Injectable()
export class StoresService {
  constructor(private readonly usersService: UsersService) {}
  async createStore(userId: number, dto: StoreCreateDto): Promise<boolean> {
    // const user = await this.usersService.getUser(userId);
    const isValidation = await this.checkValidation(dto);
    if (!isValidation) {
      return false;
    }
    return true;
  }

  async checkValidation(dto: StoreCreateDto): Promise<boolean> {
    if (!dto.name) {
      return false;
    }

    if (/[a-zA-Z]/.test(dto.name)) {
      return false;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(dto.name)) {
      return false;
    }
    return true;
  }
}
