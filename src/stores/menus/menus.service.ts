import { Injectable } from '@nestjs/common';

import { MenusRepository } from './menus.repository';
import { MenuCreateDto } from '../dto/menu-create.dto';
import { StoresService } from '../stores/stores.service';
import { MenuDto } from '../dto';

@Injectable()
export class MenusService {
  constructor(
    private readonly storesService: StoresService,
    private readonly menusRepository: MenusRepository,
  ) {}

  async createMenu(userId: number, dto: MenuCreateDto) {
    const isStoreOwned = await this.storesService.checkStoreOwned({
      userId,
      storeId: dto.storeId
    });
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

    const isMenuNameUnique = await this.checkMenuNameUnique(dto.storeId, dto.name);
    if (!isMenuNameUnique) {
      throw new Error('Menu name is not unique.');
    }

    return await this.menusRepository.createMenu(dto);
  }

  async checkMenuNameUnique(storeId: number, name: string): Promise<MenuDto | null> {
    const menu = await this.menusRepository.findOne({ storeId, name });
    const type: MenuStatus[] = ['REGISTERED', 'OPEN', 'CLOSED']
    if (menu && type.includes(menu.status)) {
      return null;
    }
    return menu;
  }
}
