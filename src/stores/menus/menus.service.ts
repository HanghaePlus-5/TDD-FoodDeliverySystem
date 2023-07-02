import { Injectable } from '@nestjs/common';

import { MenusRepository } from './menus.repository';
import { MenuCreateDto } from '../dto/menu-create.dto';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class MenusService {
  constructor(
    private readonly storesService: StoresService,
    private readonly menusRepository: MenusRepository,
  ) {}

  async createMenu(userId: number, storeId: number, dto: MenuCreateDto) {
    const isStoreOwned = await this.storesService.checkStoreOwned({ userId, storeId });
    if (!isStoreOwned) {
      throw new Error('User does not own store');
    }
    
    const isStoreStatusGroup = await this.storesService.checkStoreStatusGroup(
      isStoreOwned.status, 
      ['REGISTERED', 'OPEN', 'CLOSED'],
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }

    return this.menusRepository.createMenu(storeId, dto);
  }
}
