import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
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
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.loggerInstance.error(JSON.stringify(exception));
    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}