import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserTypeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user }: Express.Request = context.switchToHttp().getRequest();
    if (user === undefined) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
