import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { env } from 'src/config/env';
import { UnauthorizedException } from '@nestjs/common';

const jwt = new JwtService({
  secret: env().JWT_SECRET,
});

export const JwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization !== undefined) {
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || token === undefined) {
      throw new UnauthorizedException();
    }

    const userPayload = jwt.decode(token);
    // eslint-disable-next-line no-param-reassign
    req.payload = userPayload as UserPayload;
  } else {
    // eslint-disable-next-line no-param-reassign
    req.identify = uuidv4();
  }

  next();
};
