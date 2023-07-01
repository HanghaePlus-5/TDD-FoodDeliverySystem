import { Injectable } from '@nestjs/common';
import { MenuCreateDto } from '../dto/menu-create.dto';

@Injectable()
export class MenusRepository {
  constructor() {}

  async createMenu(storeId: number, dto: MenuCreateDto) {}
}
