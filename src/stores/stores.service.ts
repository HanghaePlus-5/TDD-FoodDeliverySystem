import { Injectable } from '@nestjs/common';

@Injectable()
export class StoresService {
  async createStore(userId: number, dto: any) {
    throw new Error();
  }

  async checkValidation(dto: any) {
    throw new Error();
  }
}
