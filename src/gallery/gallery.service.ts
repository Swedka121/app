import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GalleryCollection } from './shemas/gallaryColection';
import { ResourcesService } from 'src/resources/resources.service';
import { Model } from 'mongoose';
import { Resource, ResourceModel } from 'src/resources/schema/resourceSchema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(GalleryCollection.name)
    private galleryCollection: Model<GalleryCollection>,
    private resources: ResourcesService,
  ) {}

  async onModuleInit() {
    await this.ensureMainCollectionIsCreated();
  }

  private async ensureMainCollectionIsCreated() {
    const created = await this.galleryCollection.exists({ name: 'Основна' });
    if (created) return;

    const mainCollection = new this.galleryCollection({ name: 'Основна' });
    await mainCollection.save();
  }

  async getAllCollections() {
    return await this.galleryCollection.find();
  }

  async getCollectionByName(name: string) {
    return await this.galleryCollection.findOne({ name });
  }

  async createCollection(name: string) {
    const collection = new this.galleryCollection({ name });

    await collection.save();

    return collection;
  }

  async addImageToCollection(name: string, image: Resource) {
    if (image.mimeType.split('/')[0] != 'image')
      throw new BadRequestException('This resource is not image!');

    const collection = await this.getCollectionByName(name);

    if (!collection)
      throw new BadRequestException(
        'A collection with this name is undefined!',
      );

    collection.images = collection.images.filter(
      (a) => (a as ResourceModel).id != (image as ResourceModel).id,
    );
    collection.images.push(image);
    await collection.save();
    return collection;
  }

  async deleteImageFromCollection(name: string, imageID: string) {
    const collection = await this.getCollectionByName(name);

    if (!collection)
      throw new BadRequestException(
        'A collection with this name is undefined!',
      );

    collection.images = collection.images.filter(
      (a) => imageID !== (a as ResourceModel)._id.toString(),
    );

    await collection.save();
    return collection;
  }

  async deleteColection(name: string) {
    const collection = await this.getCollectionByName(name);

    if (!collection || collection.name == 'Основна')
      throw new ForbiddenException("You can't delete this collection!");

    await collection.deleteOne();

    return true;
  }
}
