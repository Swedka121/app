import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { ResourcesService } from './resources.service';
import type { UserT } from 'src/guards/roles.guard';
import { UserService } from 'src/user/user.service';
import type { Response } from 'express';

@Controller('resources')
export class ResourcesController {
  constructor(
    private service: ResourcesService,
    private users: UserService,
  ) {}
  @Post('/load/url')
  @Roles(['manager', 'admin'])
  async loadByLink(@Body('url') url: string, @User() user: UserT) {
    const { name, mimeType, real_name } = await this.service.loadFromUrl(url);
    const userModel = await this.users.findByGoogleId(user.googleId);
    if (!userModel) throw new BadRequestException('User is undefined!');
    return await this.service.createResource(
      mimeType,
      name,
      userModel,
      real_name,
    );
  }

  @Get('/:id')
  async getResource(@Res() res: Response, @Param('id') id: string) {
    const path = await this.service.getResourcePath(id);
    res.status(200).sendFile(path);
  }

  @Get('/')
  @Roles(['manager', 'admin'])
  async getAll() {
    return await this.service.getAllResources();
  }

  @Delete('/:id')
  @Roles(['manager', 'admin'])
  async deletById(@Param('id') id: string, @User() user: UserT) {
    const resource = await this.service.getResourceData(id);
    if (!resource)
      throw new BadRequestException('Resource with this is id undefined!');

    if (
      !user.roles.includes('admin') &&
      user.googleId != resource.author.googleId
    )
      throw new ForbiddenException('You have not access to delete this!');

    await this.service.deleteResource(id);
    this.service.deleteContent(resource.path);

    return 'Ok!';
  }
}
