import {
 Controller, UseGuards, Request, BadRequestException,
} from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { BearerAuthGuard } from 'src/auth/guards';
import { ResponseForm, createResponse } from 'src/utils/createResponse';

import { MenusService } from './menus.service';
import { MenuCreateDto, MenuDto } from '../dto';

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
}
