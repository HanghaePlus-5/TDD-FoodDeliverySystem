import { UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/env';

const jwt = new JwtService({
  secret: env().JWT_SECRET,
});

export const JwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization === undefined) {
    throw new UnauthorizedException();
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer' || token === undefined) {
    throw new UnauthorizedException();
  }

  const userPayload = jwt.decode(token);
  req.payload = userPayload as UserPayload;
  
  next();
}