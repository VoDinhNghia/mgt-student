/* eslint-disable class-methods-use-this */
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

export const AuthServiceAccessByKey = (keys: string[]): Type<CanActivate> => {
  class AuthAccessApi {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<Headers>();
      const accessKey = request['headers']['key-access-secret'];
      if (keys.includes(accessKey)) {
        return true;
      }
      return false;
    }
  }

  return mixin(AuthAccessApi);
};
