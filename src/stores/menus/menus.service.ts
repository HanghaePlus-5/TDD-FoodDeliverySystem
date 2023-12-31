import { Injectable } from '@nestjs/common';

import { ACTIVATE_MENU_STATUES, ACTIVATE_STORE_STATUES } from 'src/constants/stores';
import { StoresRepository } from 'src/stores/stores/stores.repository';

import { MenusRepository } from './menus.repository';
import { MenuDto } from '../dto';
import { MenuChangeStatusDto } from '../dto/menu-change-status.dto';
import { MenuCreateDto } from '../dto/menu-create.dto';
import { MenuUpdateDto } from '../dto/menu-update.dto';
import { checkMenuStatusChangeCondition, checkStoreStatusGroup } from '../utils/validation';

@Injectable()
export class MenusService {
  constructor(
    private readonly menusRepository: MenusRepository,
    private readonly storesRepository: StoresRepository,
  ) {}

  async createMenu(user: UserPayload, dto: MenuCreateDto): Promise<MenuDto> {
    const isStoreOwned = await this.storesRepository.findOne({
      userId: user.userId,
      storeId: dto.storeId,
    }, 'OWNER');
    if (!isStoreOwned) {
      throw new Error('User does not own store');
    }

    const isStoreStatusGroup = checkStoreStatusGroup(
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

  async updateMenu(user: UserPayload, dto: MenuUpdateDto): Promise<MenuDto> {
    const isStoreOwned = await this.storesRepository.findOne({
      userId: user.userId,
      storeId: dto.storeId,
    }, 'OWNER');
    if (!isStoreOwned) {
      throw new Error('User does not own store');
    }

    const isStoreStatusGroup = checkStoreStatusGroup(
      isStoreOwned.status,
      ACTIVATE_STORE_STATUES,
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }

    const isMenu = await this.menusRepository.findOne({
      storeId: dto.storeId,
      menuId: dto.menuId,
    }, ACTIVATE_MENU_STATUES);
    if (!isMenu) {
      throw new Error('Menu not found.');
    }

    if (dto.name) {
      const duplicateMenu = await this.menusRepository.findOne({
        storeId: dto.storeId,
        name: dto.name,
      }, ACTIVATE_MENU_STATUES);
      if (duplicateMenu && duplicateMenu.menuId !== dto.menuId) {
        throw new Error('Menu name is not unique on ACTIVATE_MENU_STATUES.');
      }
    }

    try {
      const menu = await this.menusRepository.update(dto);
      return menu;
    } catch (error) {
      throw new Error('Menu update failed.');
    }
  }

  async changeMenuStatus(user: UserPayload, dto: MenuChangeStatusDto): Promise<MenuDto> {
    const isStoreOwned = await this.storesRepository.findOne({
      userId: user.userId,
      storeId: dto.storeId,
    }, 'OWNER');
    if (!isStoreOwned) {
      throw new Error('User does not own store');
    }

    const isStoreStatusGroup = checkStoreStatusGroup(
      isStoreOwned.status,
      ACTIVATE_STORE_STATUES,
    );
    if (!isStoreStatusGroup) {
      throw new Error('Store status is not allowed.');
    }

    const isMenu = await this.menusRepository.findOne({
      storeId: dto.storeId,
      menuId: dto.menuId,
    }, ACTIVATE_MENU_STATUES);
    if (!isMenu) {
      throw new Error('Menu not found.');
    }

    const isMenuStatusChangeCondition = checkMenuStatusChangeCondition(
      isMenu.status,
      dto.status,
    );
    if (!isMenuStatusChangeCondition) {
      throw new Error('Menu status change condition is not met.');
    }

    try {
      const menu = await this.menusRepository.update(dto);
      return menu;
    } catch (error) {
      throw new Error('Menu status change failed.');
    }
  }

  async getMenus(storeId: number, viewType: ViewType, user?: UserPayload): Promise<MenuDto[]> {
    if (viewType === 'OWNER') {
      if (!user) {
        throw new Error('User not found.');
      }

      const isStoreOwned = await this.storesRepository.findOne({
        userId: user.userId,
        storeId,
      }, 'OWNER');
      if (!isStoreOwned) {
        throw new Error('User does not own store');
      }
    }

    try {
      const menus = await this.menusRepository.findAllByStoreId(storeId, viewType);
      return menus;
    } catch (error) {
      throw new Error('Menu retrieval failed.');
    }
  }
}
