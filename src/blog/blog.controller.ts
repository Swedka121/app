import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  Post,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from './dto/blog.dto';
import { BlogContentNode } from './schemas/blog.schema';
import { User } from 'src/decorators/user.decorator';
import type { UserT } from 'src/guards/roles.guard';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('blog')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private userService: UserService,
  ) {}

  @Get()
  async getAll() {
    return await this.blogService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.blogService.getById(id);
  }

  @Roles(['manager', 'admin'])
  @Post('/create')
  async create(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('content') content: BlogContentNode[],
    @User() user: UserT,
    @Optional()
    @Body('avatar')
    avatar: string | undefined,
  ) {
    const user_model = await this.userService.findByGoogleId(user.googleId);
    if (!user_model)
      throw new BadRequestException('User with this google id is undefined!');
    return await this.blogService.create(
      new BlogDto(title, description, content, [], user_model, avatar),
    );
  }

  @Delete('/delete/manager/:blogId')
  @Roles(['manager', 'admin'])
  async delete(@Param('blogId') blogId: string, @User() user: UserT) {
    return await this.blogService.deleteAndCheckAuthor(blogId, user.googleId);
  }

  @Delete('/delete/admin/:blogId')
  @Roles(['admin'])
  async deleteAdmin(@Param('blogId') blogId: string) {
    return await this.blogService.delete(blogId);
  }
}
