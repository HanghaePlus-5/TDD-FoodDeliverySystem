import { Injectable } from '@nestjs/common';
import { MenusRepository } from './menus.repository';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class MenusService {
  constructor(
    private readonly storesService: StoresService,
    private readonly menusRepository: MenusRepository,
  ) {}

  
}
