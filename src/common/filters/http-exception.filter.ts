/* eslint-disable @typescript-eslint/naming-convention */
import {
 ArgumentsHost, Catch, ExceptionFilter, HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { EnvService } from 'src/config/env';
import Logger from 'src/lib/winston/logger';

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
  config = new ConfigService();
  env = new EnvService(this.config);
  loggerInstance = new Logger(this.env);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.loggerInstance.error({
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
