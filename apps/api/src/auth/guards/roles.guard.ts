import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/generated/prisma/enums';
import { ROLE } from '../decorators/auth.decorator';
import { AuthJwtPayload } from '../types/auth.jwtpayload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<Role>(ROLE, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      return true;
    }
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: AuthJwtPayload }>();

    return role === user.role;
  }
}
