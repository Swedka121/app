import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schema/UserSchema';

export type ResourceModel = HydratedDocument<Resource>;

@Schema()
export class Resource {
  @Prop({
    required: true,
  })
  mimeType: string;
  @Prop({
    required: true,
    unique: true,
  })
  path: string;

  @Prop({
    required: true,
    default: new Date(),
  })
  dateOfCreation: Date;
  @Prop({
    type: User,
    required: true,
    unique: false,
    clearIndexes: true,
    excludeIndexes: true,
  })
  author: User;

  @Prop({
    required: true,
    default: 'resource',
  })
  real_name: string;
}

export const ResourceSchema = SchemaFactory.createForClass<Resource>(Resource);
