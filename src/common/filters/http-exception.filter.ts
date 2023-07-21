/* eslint-disable @typescript-eslint/naming-convention */
import {
 ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { EnvService } from 'src/config/env';
import Logger from 'src/lib/winston/logger';

@Injectable()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly loggerInstance: Logger;

  constructor(private readonly env: EnvService) {
    this.loggerInstance = new Logger(this.env);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const { payload } = req;
    const Identify = payload && payload.userId ? String(payload.userId) : req.identify || uuidv4();

    this.loggerInstance.error({
      Identify,
      Request: `${req.method} ${req.originalUrl}`,
      StatusCode: status,
      Message: exception.message,
      Stack: exception.stack || '',
    });

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
