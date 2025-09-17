import { BadRequestException, createParamDecorator } from '@nestjs/common';
import { AuthRequest } from 'src/guards/roles.guard';

export const User = createParamDecorator((data, ctx) => {
  const req: AuthRequest = ctx.switchToHttp().getRequest();

  if (!req.user) throw new BadRequestException('Use @Roles decorator first');

  return req.user;
});
