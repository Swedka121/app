import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleT } from 'src/types/roleType';

export type UserT = {
  roles: RoleT[];
  username: string;
  email: string;
  googleId: string;
  avatar: string;
};

export interface AuthRequest extends Request {
  user?: UserT;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;

    const req: AuthRequest = context.switchToHttp().getRequest();

    if (!req.headers['authorization'])
      throw new UnauthorizedException(
        "You aren't providing authorization header",
      );

    const [type, token] = req.headers['authorization']?.split(' ') || [
      null,
      null,
    ];

    switch (type) {
      case 'Bearer': {
        try {
          const decoded: { user: UserT } = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET_ACCESS,
          });

          req.user = decoded.user;

          let returned = false;

          roles.forEach((el) => {
            if (decoded.user.roles.includes(el)) returned = true;
          });

          return returned;
        } catch {
          throw new UnauthorizedException('Access tokens is unvalid');
        }
        break;
      }
      default:
        throw new UnauthorizedException("This type of tokens is't supported");
    }

    return false;
  }
}
