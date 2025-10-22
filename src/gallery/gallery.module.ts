import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { ResourcesModule } from 'src/resources/resources.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GalleryCollection,
  GalleryCollectionSchema,
} from './shemas/gallaryColection';

@Module({
  imports: [
    ResourcesModule,
    MongooseModule.forFeature([
      { name: GalleryCollection.name, schema: GalleryCollectionSchema },
    ]),
  ],
  providers: [GalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {}
