import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schema/UserSchema';

export type BlogModel = HydratedDocument<Blog>;

// Підсхема для контенту
@Schema({ _id: false }) // _id не потрібен для елементів масиву
export class BlogContentNode {
  @Prop({
    enum: ['title', 'paragraph', 'image', 'video', 'file'],
    required: true,
  })
  type: 'title' | 'paragraph' | 'image' | 'video' | 'file';

  @Prop({ required: true })
  data: string;
}

export const BlogContentNodeSchema =
  SchemaFactory.createForClass(BlogContentNode);

@Schema()
export class Blog {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: 'default' })
  avatar: string;

  @Prop({ type: [BlogContentNodeSchema], default: [] })
  content: BlogContentNode[];

  @Prop({ type: [String], default: [] })
  comments: string[];

  @Prop({
    type: User,
    required: true,
    unique: false,
    clearIndexes: true,
    excludeIndexes: true,
  })
  author: User;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
