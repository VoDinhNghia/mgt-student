import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UsersDto } from '../users/dto/users.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

export const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context
        .switchToHttp()
        .getRequest<UsersDto & { user: { role: string } }>();
      const user = request.user;
      const result = roles.includes(user.role);
      return result;
    }
  }

  return mixin(RoleGuardMixin);
};
