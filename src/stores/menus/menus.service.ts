import { Injectable } from '@nestjs/common';

import { ACTIVATE_MENU_STATUES, ACTIVATE_STORE_STATUES } from 'src/constants/stores';

import { MenusRepository } from './menus.repository';
import { MenuCreateDto } from '../dto/menu-create.dto';
import { StoresService } from '../stores/stores.service';
import { MenuUpdateDto } from '../dto/menu-update.dto';

@Injectable()
export class MenusService {
  constructor(
    private readonly storesService: StoresService,
    private readonly menusRepository: MenusRepository,
  ) {}

  async createMenu(userId: number, dto: MenuCreateDto) {
    const isStoreOwned = await this.storesService.checkStoreOwned({
      userId,
      storeId: dto.storeId,
    });
    if (!isStoreOwned) {
      throw new Error('User does not own store');
    }

    const isStoreStatusGroup = await this.storesService.checkStoreStatusGroup(
      isStoreOwned.status,
      ACTIVATE_STORE_STATUES,
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }

    const duplicateMenu = await this.menusRepository.findOne({
      storeId: dto.storeId,
      name: dto.name,
    }, ACTIVATE_MENU_STATUES);
    if (duplicateMenu) {
      throw new Error('Menu name is not unique on ACTIVATE_MENU_STATUES.');
    }

    try {
      const menu = await this.menusRepository.create(dto);
      return menu;
    } catch (error) {
      throw new Error('Menu creation failed.');
    }
  }

  async updateMenu(userId: number, dto: MenuUpdateDto) {
    const isStoreOwned = await this.storesService.checkStoreOwned({
      userId,
      storeId: dto.storeId,
    });
    if (!isStoreOwned) {
      throw new Error('User does not own store');
    }
    
    const isStoreStatusGroup = await this.storesService.checkStoreStatusGroup(
      isStoreOwned.status,
      ACTIVATE_STORE_STATUES,
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }
  }
}
