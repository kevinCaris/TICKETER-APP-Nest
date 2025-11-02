import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    context.switchToHttp().getRequest<Request>();
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    return user;
  }
}