import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { performance } from 'node:perf_hooks';

export interface AsyncStore {
  user: UserPayload;
  start: number;
}

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(
    private readonly als: AsyncLocalStorage<AsyncStore>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const store = {
      user: req.payload,
      start: performance.now(),
    };
    this.als.run(store, () => next());
  }
}
