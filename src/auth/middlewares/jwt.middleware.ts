import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { env } from 'src/config/env';

const jwt = new JwtService({
  secret: env().JWT_SECRET,
});

export const JwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    return next();
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || token === undefined) {
    return next();
  }

  const userPayload = jwt.decode(token);
  // eslint-disable-next-line no-param-reassign
  req.payload = userPayload as UserPayload;

  next();
};
