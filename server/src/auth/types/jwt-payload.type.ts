import { Request } from 'express';
import { UserRole } from 'generated/prisma';

export interface JwtPayload {
  sub: number;
  iat?: number;
  exp?: number;
}

export interface JwtPayloadWithJwtStrategy {
  id: number;
  roles: UserRole[];
}

export interface RequestWithUser extends Request {
  user: JwtPayloadWithJwtStrategy;
}
