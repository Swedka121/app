import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Resource } from 'src/resources/schema/resourceSchema';

export type GalleryCollectionModel = HydratedDocument<GalleryCollection>;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class GalleryCollection {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop()
  images: Resource[];
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const GalleryCollectionSchema =
  SchemaFactory.createForClass(GalleryCollection);
