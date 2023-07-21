import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface AsyncStore {
  user: UserPayload;
}

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(
    private readonly als: AsyncLocalStorage<AsyncStore>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const store = {
      user: req.payload,
    };
    this.als.run(store, () => next());
  }
}
