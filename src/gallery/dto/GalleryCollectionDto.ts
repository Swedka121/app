import { Resource } from 'src/resources/schema/resourceSchema';

export class GalleryCollectionDto {
  name: string;
  images: Resource[];
  createdAt: Date;
  updateAt: Date;

  constructor(
    name: string,
    images: Resource[],
    createdAt?: Date,
    updateAt?: Date,
  ) {
    this.name = name;
    this.images = images;
    this.createdAt = createdAt || new Date();
    this.updateAt = updateAt || new Date();
  }
}
