import {
 Controller, UseGuards, Request, BadRequestException,
} from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { BearerAuthGuard } from 'src/auth/guards';
import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { MenusService } from './menus.service';
import { MenuCreateDto, MenuDto, MenuUpdateDto } from '../dto';
import { MenuChangeStatusDto } from '../dto/menu-change-status.dto';

@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService,
  ) {}

  @TypedRoute.Post('/')
  @UseGuards(BearerAuthGuard)
  async createMenu(
    @Request() req: Express.Request,
    @TypedBody() form: MenuCreateDto,
  ): Promise<ResponseForm<MenuDto>> {
    if (!is<MenuCreateDto>(form)) {
      throw new BadRequestException();
    }

    const menu = await this.menusService.createMenu(req.payload, form);

    return createResponse<MenuDto>(menu);
  }

  @TypedRoute.Patch('/')
  @UseGuards(BearerAuthGuard)
  async updateMenu(
    @Request() req: Express.Request,
    @TypedBody() form: MenuUpdateDto,
  ): Promise<ResponseForm<MenuDto>> {
    if (!is<MenuUpdateDto>(form)) {
      throw new BadRequestException();
    }

    const menu = await this.menusService.updateMenu(req.payload, form);

    return createResponse<MenuDto>(menu);
  }

  @TypedRoute.Post('/status')
  @UseGuards(BearerAuthGuard)
  async changeMenuStatus(
    @Request() req: Express.Request,
    @TypedBody() form: MenuChangeStatusDto,
  ): Promise<ResponseForm<MenuDto>> {
    if (!is<MenuChangeStatusDto>(form)) {
      throw new BadRequestException();
    }

    const menu = await this.menusService.changeMenuStatus(req.payload, form);

    return createResponse<MenuDto>(menu);
  }

  // TODO : getMenus -> when UserPayload is added at middleware
}
