import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schema/UserSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: User }]),
    UserModule,
  ],
  providers: [BlogService, UserService],
  controllers: [BlogController],
})
export class BlogModule {}
