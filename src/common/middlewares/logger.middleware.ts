import { NextFunction, Request, Response } from 'express';
import { EnvService } from 'src/config/env';
import Logger from 'src/lib/winston/logger';

export default function logger(
  env: EnvService,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, originalUrl, body, query, params } = req;
  const ip = req.ip.replace(/^::ffff:/, '');
  const start = Date.now();

  const loggerInstance = new Logger(env);

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