import {
  Controller,
  Get,
  Inject,
  Optional,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private authService: AuthService) {}

  @Get('start')
  @Redirect()
  start() {
    return {
      url: this.authService.getRedirectLink(),
      status: 300,
    };
  }
  @Get('getcredentials')
  @Redirect()
  async getcredentials(
    @Optional()
    @Query('code')
    code: string,
    @Optional()
    @Query('error')
    error: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (code) {
      try {
        const tokens = await this.authService.getAccessToken(code);
        console.log(process.env.COOKIE_DOMAIN);
        res.cookie('refresh', tokens.refreshToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          domain: process.env.COOKIE_DOMAIN,
        });
        return {
          url: `${process.env.FRONT_END_URL}/login?success=${tokens.accessToken}`,
        };
      } catch (err) {
        return {
          url: `${process.env.FRONT_END_URL}/login?error=${err}`,
        };
      }
    }
    return { url: `${process.env.FRONT_END_URL}/login?error=${error}` };
  }

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['refresh'] as string;
    const tokens = await this.authService.refresh(refresh_token);

    res.cookie('refresh', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.COOKIE_DOMAIN,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return tokens.accessToken;
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('refresh', null);
    return 'Ok!';
  }
}
