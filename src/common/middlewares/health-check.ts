import { Request, Response, NextFunction } from 'express';
import { AppModule } from 'src/app.module';

export const healthCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.url === '/') {
    if (Boolean(AppModule)) {
      res.status(500).send('AppModule not found');
    } else {
      res.status(200).send('prod-env-test');
    }
  } else {
    next();
  }
}
