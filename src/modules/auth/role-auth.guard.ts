import { permission, roleTypeAccessApi } from 'src/commons/constants';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { UsersDto } from '../users/dto/users.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

export const RoleGuard = (type: string): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context
        .switchToHttp()
        .getRequest<UsersDto & { user: { role: string } }>();
      const user = request.user;
      let result = false;
      switch (type) {
        case roleTypeAccessApi.ADMIN:
          result = permission.ADMIN.includes(user.role);
          break;
        case roleTypeAccessApi.FULL:
          result = permission.FULL.includes(user.role);
          break;
        default:
          result = false;
          break;
      }
      return result;
    }
  }

  return mixin(RoleGuardMixin);
};
