import { Request, Response, NextFunction } from 'express';

export const healthCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.url === '/') {
    res.send('dev-env-test');      
  } else {
    next();
  }
}
