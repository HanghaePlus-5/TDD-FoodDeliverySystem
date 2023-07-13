import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { EnvService } from 'src/config/env';
import Logger from 'src/lib/winston/logger';

const config = new ConfigService();
const env = new EnvService(config);
const loggerInstance = new Logger(env);

export default function logger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, originalUrl, body, query, params } = req;
  console.log(req.ip)
  const ip = req.ip.replace(/^::ffff:/, '');
  const start = Date.now();

  loggerInstance.info(
    `Request : ${method} ${originalUrl} ${ip}
    Headers : ${JSON.stringify(req.headers)}
    Body : ${JSON.stringify(body)}`,
  );

  const oldSend = res.send.bind(res);
  res.send = <T>(data: T): Response<T> => {
    loggerInstance.info(
      `Response : ${method} ${originalUrl} ${ip} ${res.statusCode} ${Date.now() - start}ms
      Headers: ${JSON.stringify(res.getHeaders())}
      Body: ${JSON.stringify(data)}`,
    )
    return oldSend(data);
  }

  next();
}