import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadWithJwtStrategy, RequestWithUser } from '../types/jwt-payload.type';

export const User = createParamDecorator(
  (
    data: keyof JwtPayloadWithJwtStrategy | undefined,
    ctx: ExecutionContext,
  ): JwtPayloadWithJwtStrategy[keyof JwtPayloadWithJwtStrategy] | JwtPayloadWithJwtStrategy => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return data ? user[data] : user;
  },
);
