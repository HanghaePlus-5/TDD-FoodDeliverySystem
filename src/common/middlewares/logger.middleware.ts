/* eslint-disable @typescript-eslint/naming-convention */
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

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
  const {
 method, originalUrl, body, payload,
} = req;

  const start = Date.now();
  const Identify = payload && payload.userId ? String(payload.userId) : req.identify || uuidv4();

  loggerInstance.info({
    Identify,
    Request: `${method} ${originalUrl}`,
    Headers: res.getHeaders(),
    Body: JSON.stringify(body),
  });

  const oldSend = res.send.bind(res);
  // eslint-disable-next-line
  res.send = <T>(data: T): Response<T> => {
    const responseData = oldSend.call(res, data);

    loggerInstance.info({
      Identify,
      Response: `${method} ${originalUrl} ${res.statusCode} ${Date.now() - start}ms`,
      Headers: res.getHeaders(),
      Body: JSON.stringify(data),
    });

    return responseData;
  };

  next();
}
