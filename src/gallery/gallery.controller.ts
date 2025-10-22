import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Roles } from 'src/decorators/roles.decorator';
import { ResourcesService } from 'src/resources/resources.service';

@Controller('gallery')
export class GalleryController {
  constructor(
    private service: GalleryService,
    private resourcesService: ResourcesService,
  ) {}
  @Get('/')
  async getAllColections() {
    return await this.service.getAllCollections();
  }
  @Get('/:name')
  async getCollectionByName(@Param('name') name: string) {
    return await this.service.getCollectionByName(name);
  }

  @Post('/')
  @Roles(['admin', 'manager'])
  async createCollection(@Body('name') name: string) {
    return await this.service.createCollection(name);
  }

  @Delete('/:name')
  @Roles(['admin', 'manager'])
  async deleteCollection(@Param('name') name: string) {
    await this.service.deleteColection(name);
    return 'Ok!';
  }

  @Put('/:name')
  @Roles(['admin', 'manager'])
  async addImageToCollection(
    @Param('name') name: string,
    @Body('imageId') imageId: string,
  ) {
    const image = await this.resourcesService.getResourceData(imageId);
    if (!image)
      throw new BadRequestException('Image with this id is undefined!');

    const newCollection = await this.service.addImageToCollection(name, image);
    return newCollection;
  }

  @Delete('/:name/:imageId')
  @Roles(['admin', 'manager'])
  async deleteImageFromCollection(
    @Param('name') name: string,
    @Param('imageId') imageId: string,
  ) {
    const newCollection = await this.service.deleteImageFromCollection(
      name,
      imageId,
    );
    return newCollection;
  }
}
