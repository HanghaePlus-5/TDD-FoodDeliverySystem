/* eslint-disable*/
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';
import Logger from 'src/lib/winston/logger';

const config = new ConfigService();
const env = new EnvService(config);
const loggerInstance = new Logger(env);

@Injectable()
export class PrismaMiddleware {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  use(req: Express.Request, res, next) {
    // get data from context / decorator

    req.payload;

    // this.$on('query', (e) => {
    //   const message = {}
    //   // loggerInstance.info(`e....${req.payload.userId}`)
    // });

    next();
  }
}
