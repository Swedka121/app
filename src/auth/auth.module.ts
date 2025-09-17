import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OAuthClient } from './googleAuth';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService, OAuthClient],
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
    }),
  ],
})
export class AuthModule {}
