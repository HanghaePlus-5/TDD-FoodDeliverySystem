import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { env } from 'src/config/env';

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
  }
  
  next();
};
