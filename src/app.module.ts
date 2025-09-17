import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guards/roles.guard';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://school1:B6k0glJ4QJLWJslr@cluster0.hxmup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: 'SchoolApp' },
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    BlogModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RoleGuard }],
})
export class AppModule {}
