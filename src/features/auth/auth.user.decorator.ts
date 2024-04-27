import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiAuth } from './auth.types';

export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ApiAuth => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
