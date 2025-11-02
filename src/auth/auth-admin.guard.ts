import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      throw new UnauthorizedException('Non authentifié');
    }

    if (user.isAdmin !== true) {
      throw new ForbiddenException('Accès refusé - Admin uniquement');
    }

    return true;
  }
}
