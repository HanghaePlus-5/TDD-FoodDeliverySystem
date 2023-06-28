import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { is } from 'typia';

@Injectable()
export class UserTypeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user }: Express.Request = context.switchToHttp().getRequest();
    if (!is<UserPayload>(user)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
