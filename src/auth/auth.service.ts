/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuthClient } from './googleAuth';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/UserDto';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { User } from 'src/user/schema/UserSchema';

@Injectable()
export class AuthService {
  constructor(
    private oAuthClient: OAuthClient,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  getRedirectLink() {
    return this.oAuthClient.generateLink();
  }
  async getAccessToken(code: string) {
    const userData = (await this.oAuthClient.getUserDataByCode(code)) as {
      id: string;
      name: string;
      email: string;
      picture: string;
    };
    let user = await this.userService.findByGoogleId(userData.id);
    if (!user) {
      user = await this.userService.create(
        new UserDto(
          userData.name,
          userData.email,
          userData.id,
          ['user'],
          userData.picture,
        ),
      );
    }

    const familyId = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { user: user as User, familyId, sub: user?.googleId },
      { secret: process.env.JWT_SECRET_ACCESS, expiresIn: '5m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { user: user as User, familyId, sub: user?.googleId },
      { secret: process.env.JWT_SECRET_REFRESH, expiresIn: '1d' },
    );

    return { accessToken, refreshToken };
  }
  async refresh(refreshToken: string) {
    const decode: { sub: string } = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET_REFRESH,
    });

    const user = await this.userService.findByGoogleId(decode.sub);
    if (!user) throw new UnauthorizedException('Unvalid token data');

    const familyId = randomUUID();
    const accessToken2 = await this.jwtService.signAsync(
      { user: user as User, familyId, sub: user?.googleId },
      { secret: process.env.JWT_SECRET_ACCESS, expiresIn: '5m' },
    );
    const refreshToken2 = await this.jwtService.signAsync(
      { user: user as User, familyId, sub: user?.googleId },
      { secret: process.env.JWT_SECRET_REFRESH, expiresIn: '1d' },
    );

    return { accessToken: accessToken2, refreshToken: refreshToken2 };
  }
}
