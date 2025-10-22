import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guards/roles.guard';
import { BlogModule } from './blog/blog.module';
import { ResourcesModule } from './resources/resources.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGOOSE_LINK || '', {
      dbName: 'SchoolApp',
    }),
    UserModule,
    AuthModule,
    BlogModule,
    ResourcesModule,
    GalleryModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RoleGuard }],
})
export class AppModule {}
