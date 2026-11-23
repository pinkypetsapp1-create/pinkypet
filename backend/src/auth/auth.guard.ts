import { CanActivate, ExecutionContext, Injectable, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import { Errors } from '../common/errors';
import { AuthService } from './auth.service';

export interface AuthedRequest extends Request {
  userId?: string;
}

function bearer(req: Request): string | null {
  const h = req.headers.authorization;
  return h?.startsWith('Bearer ') ? h.slice(7).trim() : null;
}

/** Exige sesión. Deja el id de la persona en req.userId. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const token = bearer(req);
    if (!token) throw Errors.unauthorized();
    req.userId = (await this.auth.verifyAccess(token)).sub;
    return true;
  }
}

/** Sesión opcional: si llega un token válido se usa; si no llega, se sigue como invitado. Un token roto da 401. */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const token = bearer(req);
    if (token) req.userId = (await this.auth.verifyAccess(token)).sub;
    return true;
  }
}

export const UserId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest<AuthedRequest>().userId;
});
